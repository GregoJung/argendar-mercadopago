import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

const CONTENT = {
  success: {
    icon: "✓",
    tone: "success",
    title: "¡Pago aprobado!",
    body: "Tu reserva quedó confirmada. Te contactaremos antes del horario acordado.",
  },
  failure: {
    icon: "✕",
    tone: "failure",
    title: "El pago no se pudo procesar",
    body: "No se realizó ningún cobro. Podés intentar de nuevo con otro medio de pago.",
  },
  pending: {
    icon: "…",
    tone: "pending",
    title: "Pago pendiente",
    body: "Estamos esperando la confirmación de MercadoPago. Te avisaremos por email o WhatsApp apenas se acredite.",
  },
};

export default function PaymentResultPage({ status }) {
  const [searchParams] = useSearchParams();
  const { resetBooking } = useBooking();
  const content = CONTENT[status];

  // MercadoPago agrega estos parámetros al volver del Checkout Pro.
  const paymentId = searchParams.get("payment_id");
  const merchantOrderId = searchParams.get("merchant_order_id");
  const externalReference = searchParams.get("external_reference");

  useEffect(() => {
    if (status === "success") {
      resetBooking();
    }
    // En un caso real, acá podrías llamar a getPaymentStatus(externalReference)
    // contra tu backend para confirmar el estado real (no confiar solo en la URL).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="card status-page">
      <div className={`status-icon ${content.tone}`}>{content.icon}</div>
      <h1 style={{ fontSize: 22 }}>{content.title}</h1>
      <p className="helper-text">{content.body}</p>

      {(paymentId || merchantOrderId || externalReference) && (
        <div
          className="ticket-bottom"
          style={{ width: "100%", padding: "12px 0 0" }}
        >
          {paymentId && (
            <div className="ticket-row">
              <span className="ticket-row-label">ID de pago</span>
              <span className="ticket-row-value">{paymentId}</span>
            </div>
          )}
          {merchantOrderId && (
            <div className="ticket-row">
              <span className="ticket-row-label">Orden</span>
              <span className="ticket-row-value">{merchantOrderId}</span>
            </div>
          )}
          {externalReference && (
            <div className="ticket-row">
              <span className="ticket-row-label">Referencia</span>
              <span className="ticket-row-value">{externalReference}</span>
            </div>
          )}
        </div>
      )}

      <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Volver al inicio
      </Link>
    </div>
  );
}
