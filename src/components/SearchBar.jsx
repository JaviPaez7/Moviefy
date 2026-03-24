import React, { useState, useEffect, useRef } from "react";
import SearchSuggestions from "./SearchSuggestions";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(searchTerm)}&page=1&include_adult=false`;
        const response = await fetch(url);
        const data = await response.json();
        // Filtramos solo películas y series (TMDB multi search de veces incluye personas)
        const filtered = data.results
          ? data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person').slice(0, 8)
          : [];
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = () => {
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div className="search-bar-wrapper" ref={searchBarRef}>
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Buscar películas o series..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
      
      <SearchSuggestions 
        suggestions={suggestions} 
        isVisible={showSuggestions} 
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}

export default SearchBar;
