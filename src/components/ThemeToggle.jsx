import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className={`theme-toggle-btn ${theme}`} 
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      <div className="icon-wrapper">
        <span className="sun-icon">☀️</span>
        <span className="moon-icon">🌙</span>
      </div>
    </button>
  );
}

export default ThemeToggle;
