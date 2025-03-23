import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import "../styles/Footer.css"; // Importa los estilos del footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo">
          <img
            src="./public/header-home.png" // Ajusta la ruta según la ubicación de tu logo
            alt="Community On Logo"
            className="logo-image"
          />
        </div>

        {/* Redes Sociales */}
        <div className="footer-socials">
          <h3>Seguinos en redes</h3>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className="social-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} className="social-icon" />
            </a>
          </div>
        </div>

        {/* Contacto */}
        <div className="footer-contact">
          <h3>Contacto</h3>
          <p>Email: <a href="mailto:communityon@gmail.com">communityon@gmail.com</a></p>
          <p>Teléfono: <a href="tel:+54 9 351 5464113"></a>+54 9 351 5464113</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Community On. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;