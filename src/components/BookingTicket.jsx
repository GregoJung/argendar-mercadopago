import { formatCurrency } from "../data/services";

export default function BookingTicket({ booking, stamp }) {
  const { service, date, time, address, fullName } = booking;

  return (
    <div className="ticket">
      <div className="ticket-top">
        {stamp && <span className="ticket-stamp">{stamp}</span>}
        <span className="eyebrow">Comprobante de reserva</span>
        <h2 style={{ fontSize: 20 }}>{service?.title}</h2>
        <p className="helper-text" style={{ marginTop: 6 }}>
          {service?.description}
        </p>
      </div>

      <div className="ticket-perforation" />

      <div className="ticket-bottom">
        <div className="ticket-row">
          <span className="ticket-row-label">Cliente</span>
          <span className="ticket-row-value">{fullName || "—"}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-row-label">Fecha</span>
          <span className="ticket-row-value">{date || "—"}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-row-label">Horario</span>
          <span className="ticket-row-value">{time || "—"}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-row-label">Dirección</span>
          <span className="ticket-row-value">{address || "—"}</span>
        </div>
        <div className="ticket-total">
          <span className="ticket-total-label">Total a pagar</span>
          <span className="ticket-total-value">
            {service ? formatCurrency(service.price) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
