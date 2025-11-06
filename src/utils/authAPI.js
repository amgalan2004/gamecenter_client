export async function register(data) {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // ✅ Токен болон хэрэглэгчийн имэйл хадгалах
  if (result.token) {
    localStorage.setItem("gc_token", result.token);
    localStorage.setItem("userEmail", data.email);
  }

  return result;
}

export async function login(data) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // ✅ Токен болон хэрэглэгчийн имэйл хадгалах
  if (result.token) {
    localStorage.setItem("gc_token", result.token);
    localStorage.setItem("userEmail", data.email);
  }

  return result;
}

export function setToken(token) {
  localStorage.setItem("gc_token", token);
}

export function getToken() {
  return localStorage.getItem("gc_token");
}

export function clearToken() {
  localStorage.removeItem("gc_token");
  localStorage.removeItem("userEmail");
}
