import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar Mercado Pago con tu Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Ruta para crear la preferencia de pago
app.post("/api/create-preference", async (req, res) => {
  try {
    const { title, quantity, price } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: title || "Reserva de Turno", // Usamos los datos dinámicos que envíes
            quantity: Number(quantity) || 1,
            unit_price: Number(price), // ¡Asegurate de recibir el precio!
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: "https://www.google.com", // Vamos a probar con una URL real externa primero para descartar que sea problema de localhost
          failure: "https://www.google.com",
          pending: "https://www.google.com",
        },
        auto_return: "approved",
      },
    });

    // ⚠️ CAMBIO AQUÍ: Ahora devolvemos también el init_point que tu frontend espera
    res.json({
      id: result.id,
      init_point: result.init_point, // Enlace sandbox o de producción
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: "Error al generar el pago" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
