import React, { useState } from "react";
import "./Login.css";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar errores anteriores

    try {
      const response = await fetch("http://localhost:3001/api/login", { // Cambiar a tu backend local
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed");
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Ingresar</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;