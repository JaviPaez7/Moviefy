import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './SimilarContent.css';

function SimilarContent({ type, id }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const API_URL = `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${apiKey}&language=en-US&page=1`;

    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        // Tomamos los primeros 12 resultados
        setSimilar(data.results ? data.results.slice(0, 12) : []);
      } catch (error) {
        console.error('Error fetching similar content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSimilar();
  }, [type, id]);

  if (!loading && similar.length === 0) return null;

  return (
    <div className="similar-content-section">
      <h2 className="similar-title">Te puede gustar</h2>
      <div className="similar-scroll">
        {loading ? (
          <div className="similar-loading">Buscando recomendaciones...</div>
        ) : (
          similar.map((item) => (
            <div key={item.id} className="similar-card-wrapper">
              <MovieCard item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SimilarContent;
