// src/utils/reservation.js
const API_URL = import.meta.env.VITE_API_URL;

export const createReservation = async (data) => {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Reservation failed");
  }

  return res.json();
};
