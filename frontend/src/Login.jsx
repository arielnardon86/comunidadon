import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { API_BASE_URL } from "./config";

function Login({ setToken, setUsername }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validBuildings, setValidBuildings] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const { building } = useParams();
  const navigate = useNavigate();

  const normalizedBuilding = building ? building.toLowerCase().replace(/\s+/g, "-") : null;

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        console.log("Solicitando lista de edificios...");
        const response = await fetch(`${API_BASE_URL}/api/buildings`);
        if (!response.ok) throw new Error("Error al obtener los edificios");
        const data = await response.json();
        console.log("Edificios obtenidos:", data);
        setValidBuildings(data);
      } catch (error) {
        console.error("Error al obtener los edificios:", error);
        setValidBuildings(["vow"]); // Fallback a 'vow' si falla
      }
    };

    const fetchBackground = async () => {
      if (!normalizedBuilding) {
        console.log("No hay edificio normalizado, no se solicita fondo.");
        return;
      }
      try {
        const url = `${API_BASE_URL}/api/background/${normalizedBuilding}`;
        console.log("Solicitando fondo desde:", url);
        const response = await fetch(url);
        console.log("Respuesta del servidor:", response.status, response.statusText);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        console.log("Datos de la imagen:", data);
        setBackgroundImage(`${API_BASE_URL}${data.backgroundImage}`);
      } catch (error) {
        console.error("Error al obtener el fondo:", error);
        // Fallback a una URL externa confiable si la imagen local falla
        setBackgroundImage("https://via.placeholder.com/1500x500"); // Temporalmente usamos esta hasta que configures una imagen local
      }
    };

    fetchBuildings();
    fetchBackground();
  }, [normalizedBuilding, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!normalizedBuilding || (validBuildings.length > 0 && !validBuildings.includes(normalizedBuilding))) {
      console.error("Building no válido:", normalizedBuilding);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Edificio no válido. Los edificios disponibles son: ${validBuildings.join(", ") || "ninguno cargado"}.`,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${normalizedBuilding}/api/login`, {
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
      setToken(data.token);
      setUsername(usernameInput);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", usernameInput);

      const destinationRoute = `/${normalizedBuilding}`;
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

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-box">
        <h2>Iniciar Sesión - {normalizedBuilding?.replace("-", " ").toUpperCase() || "Selecciona un edificio"}</h2>
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