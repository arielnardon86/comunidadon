import { useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import "./styles/Login.css";
import vowBackground from "./assets/backgrounds/vow-background.jpg"; 


const backgroundImages = {
  vow: vowBackground,
  
};

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { building } = useParams();

  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/${building}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al iniciar sesión");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);

      Swal.fire({
        icon: "success",
        title: "Login exitoso",
        text: "Bienvenido!",
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundImage = backgroundImages[building] || defaultBackground;

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="login-box">
        <h2>Iniciar Sesión - {building.toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;