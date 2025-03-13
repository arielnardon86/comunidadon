import { useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/Login.css";
import vowBackground from "./assets/backgrounds/vow-background.jpg";
import torreBackground from "./assets/backgrounds/torre-x-background.jpg";
import defaultBackground from "./assets/backgrounds/default-portada.jpg";

const backgroundImages = {
  vow: vowBackground,
  "torre-x": torreBackground,
};

const buildingRoutes = {
  vow: "/vow",
  "torre-x": "/torre-x",
};

function Login({ setToken, setUsername }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { building } = useParams();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  console.log("API URL:", apiUrl);
  console.log("Building from useParams:", building);
  console.log("Full login URL:", `${apiUrl}/${building}/api/login`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!building || !["vow", "torre-x"].includes(building)) {
      console.error("Building no válido:", building);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Edificio no válido. Intenta con /vow o /torre-x.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${building}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Respuesta no válida del servidor",
        }));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setToken(data.token); // Usar setToken como prop
      setUsername(usernameInput); // Usar setUsername como prop
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", usernameInput);

      const destinationRoute = buildingRoutes[building] || "/vow";
      navigate(destinationRoute);

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
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="login-box">
        <h2>Iniciar Sesión - {building.replace("-", " ").toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
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