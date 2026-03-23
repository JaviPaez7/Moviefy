import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import CastSection from '../components/CastSection';
import TrailerModal from '../components/TrailerModal';
import SimilarContent from '../components/SimilarContent';
import './MovieDetailsPage.css';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const BACKDROP_SIZE = 'original';
const POSTER_SIZE = 'w500';

function MovieDetailsPage() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist } = useContext(UserContext);

  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3/movie/';

    const fetchData = async () => {
      setLoading(true);
      try {
        const detailsRes = await fetch(`${baseUrl}${id}?api_key=${apiKey}&language=en-US`);
        if (!detailsRes.ok) throw new Error('Película no encontrada.');
        const detailsData = await detailsRes.json();
        setMovieDetails(detailsData);

        const creditsRes = await fetch(`${baseUrl}${id}/credits?api_key=${apiKey}`);
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast || []);

        const videosRes = await fetch(`${baseUrl}${id}/videos?api_key=${apiKey}`);
        const videosData = await videosRes.json();
        const mainTrailer = videosData.results.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        ) || videosData.results[0];
        setTrailer(mainTrailer);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.message || 'No se pudieron cargar los detalles.');
        setLoading(false);
      }
    };

    if (id) fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="status-message">Cargando detalles de la película...</div>;
  if (error) return <div className="status-message error-message">Error: {error}</div>;
  if (!movieDetails) return <div className="status-message">No se encontraron datos.</div>;

  const isFav = isFavorite(movieDetails.id);
  const isWatch = isInWatchlist(movieDetails.id);

  return (
    <div className="movie-details-page">
      {movieDetails.backdrop_path && (
        <div className="backdrop" style={{
          backgroundImage: `url(${TMDB_IMAGE_BASE_URL}${BACKDROP_SIZE}${movieDetails.backdrop_path})`,
        }} />
      )}

      <div className="details-content">
        <div className="details-content-poster">
          <img
            src={movieDetails.poster_path ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${movieDetails.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
            alt={`Poster of ${movieDetails.title}`}
          />
        </div>
        <div className="details-content-info">
          <div className="details-header-actions">
            <h1>{movieDetails.title}</h1>
            <div className="action-buttons">
              {trailer && (
                <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                  ▶ Ver Trailer
                </button>
              )}
              <button 
                className={`favorite-btn-details ${isFav ? 'active' : ''}`} 
                onClick={() => toggleFavorite(movieDetails)}
                title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
              <button 
                className={`favorite-btn-details watchlist-btn-details ${isWatch ? 'active' : ''}`} 
                onClick={() => toggleWatchlist(movieDetails)}
                title={isWatch ? "Quitar de Ver más tarde" : "Añadir a Ver más tarde"}
              >
                {isWatch ? '🔖' : '📑'}
              </button>
            </div>
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
          
          <CastSection cast={cast} />
        </div>
      </div>

      <SimilarContent type="movie" id={id} />

      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
}

export default MovieDetailsPage;