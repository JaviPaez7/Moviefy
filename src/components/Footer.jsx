import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section main-info">
          <Link to="/" className="footer-logo">Moviefy</Link>
          <p>Tu explorador de cine premium. Descubre las últimas tendencias, guarda tus favoritos y planifica tu próxima maratón.</p>
        </div>

        <div className="footer-section links">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/favorites">Favoritos</Link></li>
            <li><Link to="/watchlist">Ver más tarde</Link></li>
          </ul>
        </div>

        <div className="footer-section attribution">
          <h4>Datos</h4>
          <p>Esta aplicación utiliza la API de TMDB pero no está avalada ni certificada por TMDB.</p>
          <div className="tmdb-logo-placeholder">
            <span className="api-badge">TMDB API</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Moviefy — Hecho con ❤️ para amantes del cine</p>
      </div>
    </footer>
  );
}

export default Footer;