import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import StepsBar from "../components/StepsBar";
import { TIME_SLOTS } from "../data/services";
import { useBooking } from "../context/BookingContext";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  const [errors, setErrors] = useState({});

  if (!booking.service) {
    return <Navigate to="/" replace />;
  }

  function validate() {
    const next = {};
    if (!booking.date) next.date = "Elegí una fecha.";
    if (!booking.time) next.time = "Elegí un horario.";
    if (!booking.address?.trim()) next.address = "Ingresá la dirección del servicio.";
    if (!booking.fullName?.trim()) next.fullName = "Ingresá tu nombre.";
    if (!booking.phone?.trim()) next.phone = "Ingresá un teléfono de contacto.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      navigate("/resumen");
    }
  }

  return (
    <>
      <StepsBar current="reserva" />
      <form className="card" onSubmit={handleSubmit} noValidate>
        <span className="eyebrow">Paso 2 de 3</span>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Datos de la reserva</h1>
        <p className="helper-text" style={{ marginBottom: 20 }}>
          {booking.service.title} · elegí cuándo y dónde.
        </p>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Fecha</label>
            <input
              id="date"
              type="date"
              min={todayISO()}
              value={booking.date}
              onChange={(e) => updateBooking({ date: e.target.value })}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
          <div className="field">
            <label>Horario</label>
          </div>
        </div>

        <div className="slot-grid" style={{ marginBottom: 18 }}>
          {TIME_SLOTS.map((slot) => (
            <button
              type="button"
              key={slot}
              className={`slot-btn ${booking.time === slot ? "is-selected" : ""}`}
              onClick={() => updateBooking({ time: slot })}
            >
              {slot}
            </button>
          ))}
        </div>
        {errors.time && (
          <span className="field-error" style={{ display: "block", marginTop: -10, marginBottom: 14 }}>
            {errors.time}
          </span>
        )}

        <div className="field">
          <label htmlFor="address">Dirección del servicio</label>
          <input
            id="address"
            type="text"
            placeholder="Calle, número, piso/depto, localidad"
            value={booking.address}
            onChange={(e) => updateBooking({ address: e.target.value })}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="fullName">Nombre y apellido</label>
            <input
              id="fullName"
              type="text"
              placeholder="Como figura en tu DNI"
              value={booking.fullName}
              onChange={(e) => updateBooking({ fullName: e.target.value })}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>
          <div className="field">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              placeholder="11 2345 6789"
              value={booking.phone}
              onChange={(e) => updateBooking({ phone: e.target.value })}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes">Notas para el profesional (opcional)</label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Referencias de acceso, detalles del pedido, etc."
            value={booking.notes}
            onChange={(e) => updateBooking({ notes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Revisar y pagar
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => navigate("/")}
        >
          Volver a servicios
        </button>
      </form>
    </>
  );
}
