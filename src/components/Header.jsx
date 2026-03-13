import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Link para navegar, useNavigate para la búsqueda
import SearchBar from "./SearchBar"; // Importa el componente SearchBar
import "./Header.css"; // Asegúrate de tener un archivo CSS para estilizar el header

function Header() {
  const navigate = useNavigate(); // Para navegar a la página de resultados

  // Función que SearchBar llamará al enviar la búsqueda
  const handleSearch = (searchTerm) => {
    console.log("Buscando:", searchTerm);
    // Navega a la página de resultados de búsqueda, pasando el término en la URL
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="header">
      <div className="site-title">
        <Link to="/">Moviefy</Link>
      </div>
      <nav className="main-nav">
        <SearchBar onSearch={handleSearch} />
        <Link to="/favorites" className="favorites-link">
          ❤️ Favoritos
        </Link>
      </nav>
    </header>
  );
}

export default Header;