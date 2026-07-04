import { useNavigate } from "react-router-dom";
import StepsBar from "../components/StepsBar";
import { SERVICES, formatCurrency } from "../data/services";
import { useBooking } from "../context/BookingContext";

export default function ServicePage() {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  function selectService(service) {
    updateBooking({ service });
  }

  function goNext() {
    if (!booking.service) return;
    navigate("/reserva");
  }

  return (
    <>
      <StepsBar current="servicio" />
      <div className="card">
        <span className="eyebrow">Paso 1 de 3</span>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Elegí un servicio</h1>
        <p className="helper-text" style={{ marginBottom: 20 }}>
          Servicios a domicilio disponibles en tu zona.
        </p>

        {SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            className={`service-option ${
              booking.service?.id === service.id ? "is-selected" : ""
            }`}
            onClick={() => selectService(service)}
          >
            <div>
              <div className="service-option-title">{service.title}</div>
              <div className="service-option-desc">{service.description}</div>
            </div>
            <div className="service-option-price">
              {formatCurrency(service.price)}
            </div>
          </button>
        ))}

        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          disabled={!booking.service}
          onClick={goNext}
        >
          Continuar
        </button>
      </div>
    </>
  );
}
