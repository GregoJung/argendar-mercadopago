import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import { initMercadoPago } from "@mercadopago/sdk-react"; // Agregar

// Inicializar Mercado pago con tu public key
initMercadoPago("TEST-a32820cb-a575-40f8-a7ed-65acb230a125");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <App />
      </BookingProvider>
    </BrowserRouter>
  </StrictMode>
);

