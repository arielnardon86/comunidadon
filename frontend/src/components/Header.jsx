import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Agregamos Link
import Swal from "sweetalert2";
import "../styles/Header.css";

function Header({ username, handleLogout, building }) {
  const navigate = useNavigate();

  console.log("Username en Header:", username); // Depuración

  const handleLogoutClick = () => {
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "¡Hasta pronto!",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      handleLogout();
      navigate(`/${building}/login`);
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Envolvemos el logo en un Link para redirigir a "/" */}
        <Link to="./Home">
          <img src="/community-on.png" alt="Community On Logo" className="header-logo" />
        </Link>
        {username && (
          <div className="header-user">
            <span>Bienvenido, {username}</span>
            <button className="logout-button" onClick={handleLogoutClick}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;