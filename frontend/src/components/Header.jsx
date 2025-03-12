import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Header.css";

function Header({ username, handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "¡Hasta pronto!",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      handleLogout();
      navigate("/vow/login");
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <img src="/community-on.png" alt="Logo" className="header-logo" /> {/* Añadir logo */}
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