import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import './MovieCard.css'; // Asegúrate de tener este archivo y sus estilos

// URL base para las imágenes de TMDB
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w500'; // Tamaño común para pósters en listas

// Este componente ahora espera una prop llamada 'item', que puede ser una película o una serie
function MovieCard({ item }) {
  const navigate = useNavigate(); // Hook para la navegación programática
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const mediaType = item.media_type ? item.media_type : (item.title !== undefined ? 'movie' : 'tv');
  const title = item.title || item.name;

  const imageUrl = item.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}`
    : null;

  const handleCardClick = () => {
    navigate(`/${mediaType}/${item.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evitar que el clic navegue a los detalles
    toggleFavorite(item);
  };

  const favIcon = isFavorite(item.id) ? '❤️' : '🤍';

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-card-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Poster of ${title || 'N/A'}`} 
          />
        ) : (
          <div className="no-poster">No poster available</div>
        )}
        <button className="favorite-btn-card" onClick={handleFavoriteClick}>
          {favIcon}
        </button>
      </div>

      <div className="movie-card-info">
        <h3>{title || 'Título Desconocido'}</h3>
        <p>Rating: {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p>
        {item.release_date && <p>{new Date(item.release_date).getFullYear()}</p>}
      </div>
    </div>
  );
}

export default MovieCard;