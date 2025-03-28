export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://comunidadon-backend.onrender.com" // Ajusta según tu URL de producción
    : "http://localhost:3001";