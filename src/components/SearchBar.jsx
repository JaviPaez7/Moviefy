import React, { useState } from 'react';
import './SearchBar.css'; // Asegúrate de tener un archivo CSS para estilizar el SearchBar

// import './SearchBar.css';

// Este componente recibirá una función 'onSearch' como prop
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState(''); // Estado para guardar el texto del input

  // Maneja el cambio en el input
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // Maneja el envío del formulario
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Previene que la página se recargue

    // Si hay una función onSearch proporcionada y la búsqueda no está vacía
    if (onSearch && query.trim()) {
      onSearch(query.trim()); // Llama a la función onSearch con el término de búsqueda
    }
    // Opcional: setQuery(''); // Limpiar el input después de buscar
  };

  return (
    // Un formulario para que al presionar Enter también se dispare la búsqueda
    <form onSubmit={handleSearchSubmit} className="search-bar"> {/* Añade clase para estilos */}
      <input
        type="text"
        placeholder="Buscar películas..."
        value={query}
        onChange={handleInputChange}
        aria-label="Buscar películas" // Buena práctica para accesibilidad
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;