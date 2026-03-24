import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <div className="not-found-icon">🎬</div>
        <p className="not-found-text">¡Vaya! Parece que esta página se ha perdido en el montaje final.</p>
        <Link to="/" className="back-home-btn">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
