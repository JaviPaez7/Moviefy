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

function TvShowDetailsPage() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist } = useContext(UserContext);

  const [tvShowDetails, setTvShowDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3/tv/';

    const fetchData = async () => {
      setLoading(true);
      try {
        const detailsRes = await fetch(`${baseUrl}${id}?api_key=${apiKey}&language=en-US`);
        if (!detailsRes.ok) throw new Error('Serie no encontrada.');
        const detailsData = await detailsRes.json();
        setTvShowDetails(detailsData);

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
        console.error('Error fetching TV data:', err);
        setError(err.message || 'No se pudieron cargar los detalles.');
        setLoading(false);
      }
    };

    if (id) fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="status-message">Cargando detalles de la serie...</div>;
  if (error) return <div className="status-message error-message">Error: {error}</div>;
  if (!tvShowDetails) return <div className="status-message">No se encontraron datos.</div>;

  const isFav = isFavorite(tvShowDetails.id);
  const isWatch = isInWatchlist(tvShowDetails.id);

  return (
    <div className="movie-details-page">
      {tvShowDetails.backdrop_path && (
        <div className="backdrop" style={{
          backgroundImage: `url(${TMDB_IMAGE_BASE_URL}${BACKDROP_SIZE}${tvShowDetails.backdrop_path})`,
        }} />
      )}

      <div className="details-content">
        <div className="details-content-poster">
          <img
            src={
              tvShowDetails.poster_path
                ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${tvShowDetails.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
            }
            alt={`Poster of ${tvShowDetails.name}`}
          />
        </div>

        <div className="details-content-info">
          <div className="details-header-actions">
            <h1>{tvShowDetails.name}</h1>
            <div className="action-buttons">
              {trailer && (
                <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                  ▶ Ver Trailer
                </button>
              )}
              <button 
                className={`favorite-btn-details ${isFav ? 'active' : ''}`} 
                onClick={() => toggleFavorite(tvShowDetails)}
                title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
              <button 
                className={`favorite-btn-details watchlist-btn-details ${isWatch ? 'active' : ''}`} 
                onClick={() => toggleWatchlist(tvShowDetails)}
                title={isWatch ? "Quitar de Ver más tarde" : "Añadir a Ver más tarde"}
              >
                {isWatch ? '🔖' : '📑'}
              </button>
            </div>
          </div>

          {tvShowDetails.tagline && (
            <p className="details-tagline">"{tvShowDetails.tagline}"</p>
          )}

          {tvShowDetails.genres && tvShowDetails.genres.length > 0 && (
            <div className="genres">
              {tvShowDetails.genres.map(genre => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>
          )}

          <p><strong>Rating:</strong> {tvShowDetails.vote_average ? tvShowDetails.vote_average.toFixed(1) : 'N/A'} / 10</p>
          <p><strong>Primera Emisión:</strong> {tvShowDetails.first_air_date || 'N/A'}</p>
          <p><strong>Temporadas:</strong> {tvShowDetails.number_of_seasons || 'N/A'}</p>
          <p><strong>Episodios:</strong> {tvShowDetails.number_of_episodes || 'N/A'}</p>
          
          <p><strong>Sinopsis:</strong><br />{tvShowDetails.overview || 'Sin sinopsis disponible.'}</p>

          <CastSection cast={cast} />
        </div>
      </div>

      <SimilarContent type="tv" id={id} />

      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
}

export default TvShowDetailsPage;