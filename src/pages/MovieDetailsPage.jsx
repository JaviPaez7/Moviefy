import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // Hook para obtener parámetros de la URL
import { FavoritesContext } from '../context/FavoritesContext';
import './MovieDetailsPage.css'; // Asegúrate de crear este archivo para los estilos
// URL base para las imágenes de TMDB (la necesitamos aquí también)
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const BACKDROP_SIZE = 'original'; // O un tamaño grande como 'w1280'
const POSTER_SIZE = 'w500';

function MovieDetailsPage() {
  // Obtiene el parámetro 'id' de la URL (definido en App.jsx como /movie/:id)
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  // Estado para los detalles de la película, carga y error
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtén la clave API
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    // URL de la API para obtener detalles de una película específica por ID
    const API_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`; // Ajusta el lenguaje si quieres

    console.log("Realizando llamada a la API para detalles:", API_URL);

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          // Si es un 404, la película no se encontró
          if (response.status === 404) {
             throw new Error("Película no encontrada.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Detalles de película recibidos:", data);
        setMovieDetails(data); // Guarda todos los detalles
        setLoading(false);

      } catch (error) {
        console.error("Error al obtener detalles de la película:", error);
        setError(error.message || "No se pudieron cargar los detalles de la película.");
        setLoading(false);
      }
    };

    // Asegúrate de que hay un ID antes de intentar fetchear
    if (id) {
      fetchMovieDetails();
    } else {
       // Si por alguna razón no hay ID en la URL (no debería pasar con la ruta configurada)
       setError("ID de película no proporcionado.");
       setLoading(false);
    }

  }, [id]); // Este efecto se re-ejecutará si el 'id' en la URL cambia

  // Renderizado condicional
  if (loading) {
    return <div>Cargando detalles de la película...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Si ya cargó y no hay error, y movieDetails no es null
  if (!movieDetails) {
      return <div>No se encontraron datos para esta película.</div>;
  }

  const handleFavoriteClick = () => {
    toggleFavorite(movieDetails);
  };
  const favIcon = isFavorite(movieDetails.id) ? '❤️' : '🤍';

  // Mostrar los detalles de la película
  return (
    <div className="movie-details-page">
      {/* Puedes usar el 'backdrop_path' para un fondo grande o el 'poster_path' */}
      {movieDetails.backdrop_path && (
          <div className="backdrop" style={{
              backgroundImage: `url(${TMDB_IMAGE_BASE_URL}${BACKDROP_SIZE}${movieDetails.backdrop_path})`,
          }}>
              {/* Podrías poner el título o un poster pequeño superpuesto aquí */}
              {/* <h2>{movieDetails.title}</h2> */}
          </div>
      )}

      <div className="details-content">
        <div className="details-content-poster">
          <img
            src={movieDetails.poster_path ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${movieDetails.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
            alt={`Poster of ${movieDetails.title}`}
          />
        </div>
        <div className="details-content-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1>{movieDetails.title}</h1>
            <button className="favorite-btn-details" onClick={handleFavoriteClick}>
              {favIcon}
            </button>
          </div>
          {movieDetails.tagline && <p className="details-tagline">{movieDetails.tagline}</p>}
          
          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <div className="genres">
              {movieDetails.genres.map(genre => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>
          )}

          <p><strong>Rating:</strong> {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : 'N/A'}</p>
          <p><strong>Fecha de Estreno:</strong> {movieDetails.release_date || 'N/A'}</p>
          <p><strong>Sinopsis:</strong> <br/> {movieDetails.overview || 'Sin sinopsis disponible.'}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;