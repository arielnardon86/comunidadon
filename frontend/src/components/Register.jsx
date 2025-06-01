import { useState } from "react";
import Swal from "sweetalert2";

function Register({ setToken, setShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  // Función para decodificar el payload del token JWT (sin verificar la firma)
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = import.meta.env.VITE_ADMIN_TOKEN || localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de administrador no encontrado. Configura VITE_ADMIN_TOKEN en .env o inicia sesión.");
      }

      // Decodificar el token para obtener el building
      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.building) {
        throw new Error("No se pudo determinar el edificio desde el token.");
      }
      const building = decodedToken.building;

      const response = await fetch(`${apiUrl}/${building}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, phone_number, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar");
      }

      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "¡Usuario registrado! Ahora puedes iniciar sesión.",
      });
      setUsername("");
      setPassword("");
      setPhoneNumber("");
      setEmail("");
      setShowRegister(false);
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Registro</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone Number (opcional):</label>
          <input
            type="text"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email (opcional):</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;