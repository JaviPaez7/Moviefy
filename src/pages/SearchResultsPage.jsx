import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook para leer query parameters
import MovieCard from '../components/MovieCard'; // Para mostrar los resultados
// Puedes crear un archivo CSS para SearchResultsPage.css

function SearchResultsPage() {
  // Hook para leer y modificar los query parameters de la URL (?query=...)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('query'); // Obtiene el valor del parámetro 'query'

  // Estado para los resultados de búsqueda, carga y error
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para realizar la búsqueda cuando el término de búsqueda cambie
  useEffect(() => {
    if (!searchTerm) {
      // Si no hay término de búsqueda en la URL, no hacemos nada o mostramos un mensaje
      setResults([]); // Limpia resultados anteriores
      setLoading(false);
      setError("Por favor, introduce un término de búsqueda.");
      return; // Sale del efecto
    }

    // Restablece estados al iniciar una nueva búsqueda
    setLoading(true);
    setError(null);
    setResults([]); // Opcional: limpiar resultados anteriores mientras carga

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    // Endpoint para buscar películas
    // Para buscar también series, podrías usar '/search/multi' en lugar de '/search/movie'
    const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}&language=en-US&page=1`;

    console.log("Realizando búsqueda:", API_URL);

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Resultados de búsqueda recibidos:", data);
        setResults(data.results); // TMDB devuelve los resultados en 'results'
        setLoading(false);
      } catch (error) {
        console.error("Error al buscar:", error);
        setError("Hubo un error al realizar la búsqueda. Inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchSearchResults();

  }, [searchTerm]); // Este efecto se re-ejecuta cada vez que 'searchTerm' cambia en la URL

  // Renderizado condicional
  if (loading) {
    return <div className="status-message">Cargando resultados para "{searchTerm}"...</div>;
  }

  if (error) {
    return <div className="status-message error-message">Error: {error}</div>; // Añade error-message también
  }

  if (results.length === 0 && searchTerm) {
      return <div className="status-message">No se encontraron resultados para "{searchTerm}".</div>;
  }

   if (results.length === 0 && !searchTerm) {
      return <div className="status-message">Introduce un término para buscar películas.</div>;
  }


  // Mostrar los resultados si hay
  return (
    <div className="search-results-page">
      <h1>Resultados de Búsqueda para "{searchTerm}"</h1>

       <div className="movies-list">
        {/* --- AÑADE .filter(item => item != null) AQUÍ --- */}
        {results
          .filter(item => item != null) // Filtra elementos nulos o indefinidos
          .map(result => (
           <MovieCard key={result.id} item={result} />
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;