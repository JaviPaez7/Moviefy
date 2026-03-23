import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [isSurprising, setIsSurprising] = useState(false);

  const handleSearch = (searchTerm) => {
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleSurpriseMe = async () => {
    setIsSurprising(true);
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    
    try {
      // Elegimos una página aleatoria de populares (1-5)
      const types = ['movie', 'tv'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const response = await fetch(`https://api.themoviedb.org/3/trending/${randomType}/week?api_key=${apiKey}&language=es-ES`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomItem = data.results[randomIndex];
        
        // Pequeña pausa para efecto dramático
        setTimeout(() => {
          navigate(`/${type}/${randomItem.id}`);
          setIsSurprising(false);
        }, 600);
      }
    } catch (error) {
      console.error("Error in Surprise Me:", error);
      setIsSurprising(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Moviefy
        </Link>
        <SearchBar onSearch={handleSearch} />

        <div className="header-actions">
          <button 
            className={`surprise-btn ${isSurprising ? 'loading' : ''}`} 
            onClick={handleSurpriseMe}
            title="¡Sorpréndeme! (Recomendación aleatoria)"
            disabled={isSurprising}
          >
            {isSurprising ? '🎲...' : '🎲'}
          </button>

          <nav className="header-nav">
            <Link to="/favorites" className="nav-link fav-link">
              <span className="nav-icon">❤️</span>
              <span className="nav-text">Favoritos</span>
            </Link>
            <Link to="/watchlist" className="nav-link watch-link">
              <span className="nav-icon">🔖</span>
              <span className="nav-text">Pendientes</span>
            </Link>
          </nav>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;