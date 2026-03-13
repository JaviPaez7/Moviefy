import React, { useState, useEffect } from "react";
// Ya no necesitamos estilos específicos aquí si usamos los del Header, pero dejamos el import si hay algo extra.
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!query.trim()) return; 

    setIsTyping(true);
    const timeout = setTimeout(() => {
      onSearch(query.trim());
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form" role="search">
      <label htmlFor="search" className="visually-hidden">
        Buscar películas o series
      </label>
      <input
        id="search"
        type="text"
        className="search-input"
        placeholder="Buscar..."
        value={query}
        onChange={handleInputChange}
        aria-label="Buscar películas o series"
        autoFocus
        onFocus={(e) => e.target.select()}
      />
      <button type="submit" className="search-button" disabled={!query.trim() || isTyping}>
        {isTyping ? "..." : "Buscar"}
      </button>
    </form>
  );
}

export default SearchBar;
