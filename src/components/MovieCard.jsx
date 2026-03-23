import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './MovieCard.css';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w342';

function MovieCard({ item }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist } = useContext(UserContext);

  if (!item) return null;

  const {
    id,
    title,
    name,
    poster_path,
    release_date,
    first_air_date,
    vote_average,
  } = item;

  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const year = displayDate ? displayDate.split('-')[0] : 'N/A';
  const type = title ? 'movie' : 'tv';

  const handleCardClick = () => {
    navigate(`/${type}/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(item);
  };

  const isFav = isFavorite(id);
  const isWatch = isInWatchlist(id);

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-card-image-wrapper">
        <img
          src={poster_path ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${poster_path}` : 'https://via.placeholder.com/342x513?text=No+Poster'}
          alt={displayTitle}
          loading="lazy"
        />
        <div className="card-actions">
          <button 
            className={`card-action-btn favorite-btn ${isFav ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button 
            className={`card-action-btn watchlist-btn ${isWatch ? 'active' : ''}`}
            onClick={handleWatchlistClick}
            title={isWatch ? "Quitar de Ver más tarde" : "Añadir a Ver más tarde"}
          >
            {isWatch ? '🔖' : '📑'}
          </button>
        </div>
      </div>
      <div className="movie-card-info">
        <h3>{displayTitle}</h3>
        <div className="movie-meta">
          <span className="movie-year">{year}</span>
          <StarRating rating={vote_average} />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  if (rating === undefined) return null;
  const stars = Math.round(rating / 2);
  const colorClass = rating >= 7 ? 'gold' : rating >= 5 ? 'gray' : 'red';

  return (
    <div className="star-rating" title={`Rating: ${rating.toFixed(1)}`}>
      <div className={`stars ${colorClass}`}>
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </div>
    </div>
  );
}

export default MovieCard;