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
// Ejemplo de cómo debería estar en tu archivo ../services/api.js
export async function createPaymentPreference(booking) {
  const response = await fetch("http://localhost:4000/api/create-preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Mapeamos los datos de tu context "booking" al formato del backend
    body: JSON.stringify({
      title: `Reserva de ${booking.service.name || "Servicio"}`, // Ajustalo según la estructura de tu servicio
      quantity: 1,
      price: booking.service.price, // El precio que venga del contexto
    }),
  });

  if (!response.ok) {
    throw new Error("Error en la comunicación con el servidor de pagos");
  }

  return await response.json(); // Esto devolverá { id, init_point }
}

/**
 * Opcional: consulta al backend el estado real de un pago/reserva
 * (por ejemplo cuando MercadoPago redirige de vuelta a /pago/pendiente).
 *   GET {API_URL}/api/payments/:bookingId/status
 *   response 200: { status: "approved" | "pending" | "rejected" }
 */
export async function getPaymentStatus(bookingId) {
  const response = await fetch(`${API_URL}/api/payments/${bookingId}/status`);
  if (!response.ok) {
    throw new Error(`No se pudo consultar el estado (${response.status})`);
  }
  return response.json();
}
