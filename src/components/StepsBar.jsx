const STEPS = [
  { key: "servicio", label: "Servicio" },
  { key: "reserva", label: "Reserva" },
  { key: "pago", label: "Pago" },
];

export default function StepsBar({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="steps-bar" aria-label="Progreso de la reserva">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;
        return (
          <div
            className="step-wrap"
            style={{ display: "flex", alignItems: "center", flex: index < STEPS.length - 1 ? 1 : "initial" }}
            key={step.key}
          >
            <div className={`step ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}>
              <span className="step-num">{isDone ? "✓" : index + 1}</span>
              <span>{step.label}</span>
            </div>
            {index < STEPS.length - 1 && <span className="step-divider" />}
          </div>
        );
      })}
    </div>
  );
}
