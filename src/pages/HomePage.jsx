import React, { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import './HomePage.css';

function HomePage() {
  const [contentType, setContentType] = useState('movie'); // 'movie' or 'tv'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [heroMovie, setHeroMovie] = useState(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Use a ref to attach to the last element we want to observe
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

  // Si cambiamos de pestaña (Películas <-> Series), hay que resetear la paginación y la lista
  const handleTabChange = (type) => {
    if (contentType === type) return; // Ya estamos en esta pestaña
    setContentType(type);
    setItems([]);
    setPage(1);
    setHasMore(true);
    setHeroMovie(null); // Opcional: limpiar o no el banner al cambiar
  };

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const API_URL = `https://api.themoviedb.org/3/${contentType}/popular?api_key=${apiKey}&language=en-US&page=${page}`;

    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }

        const data = await response.json();

        setItems(prev => {
          if (page === 1 && data.results.length > 0) {
            setHeroMovie(data.results[0]); 
          }
          return [...prev, ...data.results];
        });

        if (data.results.length === 0 || data.page >= data.total_pages) {
          setHasMore(false);
        }

      } catch (error) {
        console.error("Error:", error);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentType, page]); 


  return (
    <div className="homepage">
      {/* Banner Principal (Hero) */}
      {heroMovie && (
        <div className="hero-banner" style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
        }}>
          <div className="hero-content">
            <h2>{heroMovie.title || heroMovie.name}</h2>
            <p>{heroMovie.overview}</p>
          </div>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="content-tabs">
        <button 
          className={`tab-btn ${contentType === 'movie' ? 'active' : ''}`} 
          onClick={() => handleTabChange('movie')}
        >
          🎬 Películas
        </button>
        <button 
          className={`tab-btn ${contentType === 'tv' ? 'active' : ''}`} 
          onClick={() => handleTabChange('tv')}
        >
          📺 Series
        </button>
      </div>

      <h1 className="section-title">
        {contentType === 'movie' ? 'Películas Populares' : 'Series Populares'}
      </h1>

      {error && <div className="status-message error-message">Error: {error}</div>}
      {!loading && !error && items.length === 0 && <div className="status-message">No hay contenido disponible.</div>}

      <div className="movies-list"> 
        {items.filter(item => item != null).map((item, index) => {
          // El último elemento activa el Intersection Observer
          if (items.length === index + 1) {
            return <div ref={lastElementRef} key={`${contentType}-${item.id}-${index}`}><MovieCard item={item} /></div>
          } else {
            return <MovieCard key={`${contentType}-${item.id}-${index}`} item={item} />
          }
        })}
      </div>
      
      {loading && <div className="status-message">Cargando más resultados...</div>}

    </div>
  );
}

export default HomePage;