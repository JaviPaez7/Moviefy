import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link para navegar, useNavigate para la búsqueda
import SearchBar from './SearchBar'; // Importa el componente SearchBar
import './Header.css'; // Asegúrate de tener un archivo CSS para estilizar el header
// import './Header.css';

function Header() {
  const navigate = useNavigate(); // Para navegar a la página de resultados

  // Función que SearchBar llamará al enviar la búsqueda
  const handleSearch = (searchTerm) => {
    console.log("Buscando:", searchTerm);
    // Navega a la página de resultados de búsqueda, pasando el término en la URL
    // Usamos 'search' y un query parameter '?query='
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`); // encodeURIComponent para términos con espacios o caracteres especiales
  };

  return (
    // Puedes añadir una clase para estilizar el header
    <header className="header">
      <div className="site-title">
        {/* Un enlace a la página de inicio */}
        <Link to="/">Moviefy</Link>
      </div>
      <nav className="main-nav">
        {/* Aquí iría SearchBar */}
        <SearchBar onSearch={handleSearch} />
        {/* Otros enlaces de navegación si los tienes */}
      </nav>
    </header>
  );
}

export default Header;