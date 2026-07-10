import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StepsBar from "../components/StepsBar";
import BookingTicket from "../components/BookingTicket";
import { useBooking } from "../context/BookingContext";
import { createPaymentPreference } from "../services/api";

export default function SummaryPage() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!booking.service || !booking.date || !booking.time) {
    return <Navigate to="/" replace />;
  }

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const { init_point } = await createPaymentPreference(booking);
      if (!init_point) {
        throw new Error("El backend no devolvió init_point.");
      }
      // Checkout Pro: redirigimos al checkout hospedado de MercadoPago.
      window.location.href = init_point;
    } catch (err) {
      setError(
        err.message ||
          "No pudimos iniciar el pago. Verificá que el backend esté corriendo.",
      );
      setLoading(false);
    }
  }

  return (
    <>
      <StepsBar current="pago" />

      <BookingTicket booking={booking} stamp="Pendiente de pago" />

      {error && <div className="notice">{error}</div>}

      <div className="card" style={{ paddingTop: 20 }}>
        <p className="helper-text" style={{ marginBottom: 14 }}>
          Al continuar vas a ser redirigido al Checkout de MercadoPago para
          completar el pago de forma segura.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Redirigiendo a MercadoPago…" : "Pagar con MercadoPago"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => navigate("/reserva")}
          disabled={loading}
        >
          Volver y editar datos
        </button>
      </div>
    </>
  );
}
