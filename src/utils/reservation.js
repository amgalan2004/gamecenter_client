// src/utils/reservation.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const createReservation = async (data) => {
  // LocalStorage-оос токеноо авах (хэрэв байгаа бол)
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "" // Токен нэмэх
    },
    // credentials: "include", // CORS тохиргооноос хамаарч ашиглана
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    // Серверээс ирсэн тодорхой алдааг (жишээ нь: "Энэ суудал захиалагдсан байна") буцаах
    throw new Error(result.message || result.error || "Захиалга амжилтгүй боллоо");
  }

  return result;
};