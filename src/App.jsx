import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ServicePage from "./pages/ServicePage";
import BookingPage from "./pages/BookingPage";
import SummaryPage from "./pages/SummaryPage";
import PaymentResultPage from "./pages/PaymentResultPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ServicePage />} />
          <Route path="/reserva" element={<BookingPage />} />
          <Route path="/resumen" element={<SummaryPage />} />
          <Route
            path="/pago/exito"
            element={<PaymentResultPage status="success" />}
          />
          <Route
            path="/pago/error"
            element={<PaymentResultPage status="failure" />}
          />
          <Route
            path="/pago/pendiente"
            element={<PaymentResultPage status="pending" />}
          />
        </Routes>
      </main>
    </div>
  );
}
