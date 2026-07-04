// Catálogo de servicios de ejemplo.
// En un caso real esto vendría de tu API (GET /api/services) conectada a MySQL/Postgres.
export const SERVICES = [
  {
    id: "limpieza-estandar",
    title: "Limpieza estándar",
    description: "Limpieza general de hasta 2 ambientes, 2 horas.",
    price: 12000,
  },
  {
    id: "limpieza-profunda",
    title: "Limpieza profunda",
    description: "Incluye zócalos, electrodomésticos y ventanas, 4 horas.",
    price: 22000,
  },
  {
    id: "mantenimiento-electrico",
    title: "Mantenimiento eléctrico",
    description: "Revisión de tablero, tomas y artefactos, 1 hora.",
    price: 15000,
  },
  {
    id: "destapaciones",
    title: "Plomería y destapaciones",
    description: "Visita técnica + resolución de una urgencia simple.",
    price: 18000,
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "15:30",
  "17:00",
];

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
