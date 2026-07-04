const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Le pide al backend que cree una preferencia de pago de MercadoPago
 * (Checkout Pro) para la reserva actual, y devuelve la URL de redirección.
 *
 * Contrato esperado con el backend (Node.js + Express):
 *   POST {API_URL}/api/payments/create-preference
 *   body: {
 *     service: { id, title, price },
 *     date, time, address, fullName, phone, notes
 *   }
 *   response 200: { init_point: string, preferenceId: string, bookingId: string }
 *
 * El backend es quien tiene el Access Token de MercadoPago, arma los
 * `items`, define `back_urls` (success/failure/pending) y `notification_url`
 * para el webhook, y persiste la reserva en MySQL/Postgres con estado "pending".
 */
export async function createPaymentPreference(booking) {
  const response = await fetch(`${API_URL}/api/payments/create-preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service: {
        id: booking.service.id,
        title: booking.service.title,
        price: booking.service.price,
      },
      date: booking.date,
      time: booking.time,
      address: booking.address,
      fullName: booking.fullName,
      phone: booking.phone,
      notes: booking.notes,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `El backend respondió con estado ${response.status}`
    );
  }

  return response.json();
}

/**
 * Opcional: consulta al backend el estado real de un pago/reserva
 * (por ejemplo cuando MercadoPago redirige de vuelta a /pago/pendiente).
 *   GET {API_URL}/api/payments/:bookingId/status
 *   response 200: { status: "approved" | "pending" | "rejected" }
 */
export async function getPaymentStatus(bookingId) {
  const response = await fetch(
    `${API_URL}/api/payments/${bookingId}/status`
  );
  if (!response.ok) {
    throw new Error(`No se pudo consultar el estado (${response.status})`);
  }
  return response.json();
}
