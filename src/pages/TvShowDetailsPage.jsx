import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import CastSection from '../components/CastSection';
import TrailerModal from '../components/TrailerModal';
import MovieReviews from '../components/MovieReviews';
import SimilarContent from '../components/SimilarContent';
import SkeletonDetails from '../components/SkeletonDetails';
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
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3/tv/';

    const fetchData = async () => {
      setLoading(true);
      try {
        const detailsRes = await fetch(`${baseUrl}${id}?api_key=${apiKey}&language=es-ES`);
        if (!detailsRes.ok) throw new Error('Serie no encontrada.');
        const detailsData = await detailsRes.json();
        setTvShowDetails(detailsData);

        const creditsRes = await fetch(`${baseUrl}${id}/credits?api_key=${apiKey}`);
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast || []);

        // Fetch Trailers
        let videosRes = await fetch(`${baseUrl}${id}/videos?api_key=${apiKey}&language=es-ES`);
        let videosData = await videosRes.json();
        
        let trailer = videosData.results?.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        );

        // Fallback to English if no Spanish trailer
        if (!trailer) {
          videosRes = await fetch(`${baseUrl}${id}/videos?api_key=${apiKey}&language=en-US`);
          videosData = await videosRes.json();
          trailer = videosData.results?.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
          ) || videosData.results?.[0];
        }

        setTrailer(trailer);

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

  if (loading) return <SkeletonDetails />;
  if (error) return <div className="status-message error-message">Error: {error}</div>;
  if (!tvShowDetails) return <div className="status-message">No se encontraron datos.</div>;

  const isFav = isFavorite(tvShowDetails.id);
  const isWatch = isInWatchlist(tvShowDetails.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

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

              <button 
                className={`favorite-btn-details share-btn ${shareSuccess ? 'success' : ''}`} 
                onClick={handleShare}
                title="Compartir enlace"
              >
                {shareSuccess ? '✅' : '🔗'}
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

          <p><strong>Puntuación:</strong> {tvShowDetails.vote_average ? tvShowDetails.vote_average.toFixed(1) : 'N/A'} / 10</p>
          <p><strong>Fecha de Estreno:</strong> {tvShowDetails.first_air_date || 'N/A'}</p>
          <p><strong>Temporadas:</strong> {tvShowDetails.number_of_seasons || 'N/A'}</p>
          <p><strong>Episodios:</strong> {tvShowDetails.number_of_episodes || 'N/A'}</p>
          
          <p><strong>Sinopsis:</strong><br />{tvShowDetails.overview || 'Sin sinopsis disponible.'}</p>

          <CastSection cast={cast} />
          <MovieReviews type="tv" id={id} />
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