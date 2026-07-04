import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "hogarclick_booking";

const emptyBooking = {
  service: null, // { id, title, description, price }
  date: "",
  time: "",
  address: "",
  fullName: "",
  phone: "",
  notes: "",
};

function loadInitialState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyBooking, ...JSON.parse(raw) } : emptyBooking;
  } catch {
    return emptyBooking;
  }
}

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(loadInitialState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
  }, [booking]);

  function updateBooking(patch) {
    setBooking((prev) => ({ ...prev, ...patch }));
  }

  function resetBooking() {
    setBooking(emptyBooking);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking debe usarse dentro de <BookingProvider>");
  }
  return ctx;
}
