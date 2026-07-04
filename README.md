# Argendar — Frontend de reserva y pago (React + Vite)

Frontend de ejemplo para practicar la integración de **MercadoPago Checkout Pro**.
Simula la contratación de un servicio a domicilio: elegir servicio → reservar
fecha/horario → pagar. El pago real lo procesa MercadoPago; este frontend
solo arma los datos y redirige.

## Correr el proyecto

```bash
npm install
cp .env.example .env   # ajustá VITE_API_URL si tu backend corre en otro puerto
npm run dev
```

## Flujo de pantallas

| Ruta               | Descripción                                                   |
|---------------------|----------------------------------------------------------------|
| `/`                 | Catálogo de servicios (mock en `src/data/services.js`)        |
| `/reserva`          | Formulario: fecha, horario, dirección, contacto               |
| `/resumen`          | Ticket con el resumen + botón "Pagar con MercadoPago"         |
| `/pago/exito`       | `back_urls.success` de MercadoPago                             |
| `/pago/error`       | `back_urls.failure` de MercadoPago                             |
| `/pago/pendiente`   | `back_urls.pending` de MercadoPago                              |

El estado de la reserva se guarda en `sessionStorage` (`context/BookingContext.jsx`)
para que sobreviva la navegación entre pasos.

## Lo que tenés que construir en el backend (Node.js + Express)

El único punto de contacto con tu API está en `src/services/api.js`.

### 1. Crear preferencia de pago

```
POST /api/payments/create-preference
Body:
{
  "service": { "id": "limpieza-estandar", "title": "Limpieza estándar", "price": 12000 },
  "date": "2026-07-10",
  "time": "10:30",
  "address": "Av. Siempre Viva 742",
  "fullName": "Ana Pérez",
  "phone": "1123456789",
  "notes": "Portero eléctrico, tocar timbre 3B"
}

Response 200:
{ "init_point": "https://www.mercadopago.com.ar/checkout/v1/...", "preferenceId": "...", "bookingId": "..." }
```

Dentro de ese endpoint, con el SDK oficial (`mercadopago` npm package):

```js
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

app.post("/api/payments/create-preference", async (req, res) => {
  const { service, date, time, address, fullName, phone, notes } = req.body;

  // 1. Guardar la reserva en tu base (MySQL/Postgres) con estado "pending"
  //    y guardar el id generado como bookingId.

  const preference = new Preference(client);
  const result = await preference.create({
    body: {
      items: [
        {
          id: service.id,
          title: service.title,
          quantity: 1,
          unit_price: service.price,
          currency_id: "ARS",
        },
      ],
      payer: { name: fullName, phone: { number: phone } },
      metadata: { bookingId, date, time, address, notes },
      external_reference: bookingId,
      back_urls: {
        success: "http://localhost:5173/pago/exito",
        failure: "http://localhost:5173/pago/error",
        pending: "http://localhost:5173/pago/pendiente",
      },
      auto_return: "approved",
      notification_url: "https://tu-dominio.com/api/payments/webhook",
    },
  });

  res.json({
    init_point: result.init_point,
    preferenceId: result.id,
    bookingId,
  });
});
```

### 2. Webhook de notificaciones

MercadoPago llama a `notification_url` cuando cambia el estado de un pago.
Ahí es donde tenés que confirmar el pago real (nunca confiar solo en los
parámetros de la URL de retorno) y actualizar el estado de la reserva en
tu base de datos:

```
POST /api/payments/webhook
```

### 3. Consultar estado (opcional, usado por `getPaymentStatus` en `api.js`)

```
GET /api/payments/:bookingId/status
Response: { "status": "approved" | "pending" | "rejected" }
```

### Modelo de datos sugerido (MySQL/Postgres)

```
bookings
  id (uuid/pk)
  service_id, service_title, price
  date, time, address
  full_name, phone, notes
  status        -- pending | approved | rejected
  mp_preference_id
  mp_payment_id
  created_at
```

## Variables de entorno

- **Frontend** (`.env`): `VITE_API_URL` → URL del backend.
- **Backend** (no vive en este repo): `MP_ACCESS_TOKEN` (Access Token de
  producción o de test de tu cuenta de MercadoPago) y la conexión a
  MySQL/Postgres.

## Notas

- Usá credenciales de **test** de MercadoPago mientras practicás
  (usuarios de prueba comprador/vendedor desde el panel de developers).
- `auto_return: "approved"` hace que MercadoPago redirija solo en pagos
  aprobados; para tarjetas rechazadas el usuario vuelve manualmente.
- Este frontend no maneja autenticación ni persistencia real: es una base
  para que conectes tu propio backend.
