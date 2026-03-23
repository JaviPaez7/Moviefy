import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const SKELETON_COUNT = 8;

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('query');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setLoading(false);
      setError('Por favor, introduce un término de búsqueda.');
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const API_URL = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}&language=en-US&page=${page}`;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const relevantResults = data.results.filter(
          item => item.media_type === 'movie' || item.media_type === 'tv'
        );
        relevantResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        setResults(prev => [...prev, ...relevantResults]);
        setHasMore(data.page < data.total_pages);
        setLoading(false);
      } catch (error) {
        console.error('Error al buscar:', error);
        setError('Hubo un error al realizar la búsqueda. Inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, page]);

  if (results.length === 0 && !searchTerm) {
    return <div className="status-message">Introduce un término para buscar películas o series.</div>;
  }

  return (
    <div className="search-results-page">
      <h1>Resultados para "{searchTerm}"</h1>

      {error && <div className="status-message error-message">Error: {error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="status-message">No se encontraron resultados para "{searchTerm}".</div>
      )}

      <div className="movies-list">
        {results
          .filter(item => item != null)
          .map((result, index) => {
            if (results.length === index + 1) {
              return (
                <div ref={lastElementRef} key={`res-${result.id}-${index}`}>
                  <MovieCard item={result} />
                </div>
              );
            }
            return <MovieCard key={`res-${result.id}-${index}`} item={result} />;
          })}

        {/* Skeleton loaders */}
        {loading && Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;