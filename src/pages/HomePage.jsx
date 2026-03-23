import React, { useState, useEffect, useCallback, useRef } from "react";
import MovieCard from "../components/MovieCard";
import GenreFilter from "../components/GenreFilter";
import SkeletonCard from "../components/SkeletonCard";
import "./HomePage.css";

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

function HomePage() {
  const [items, setItems] = useState([]);
  const [heroItem, setHeroItem] = useState(null);
  const [contentType, setContentType] = useState("movie"); // 'movie' or 'tv'
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loaderRef = useRef(null);

  // Fetch Hero Item (Solo una vez al cargar)
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setHeroItem(data.results[0]);
        }
      })
      .catch(err => console.error("Error fetching hero:", err));
  }, []);

  const fetchItems = useCallback(async (isNextPage = false) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const currentPage = isNextPage ? page + 1 : 1;
    
    if (!isNextPage) {
      setLoading(true);
      setIsInitialLoad(true);
    }

    try {
      let url = `https://api.themoviedb.org/3/discover/${contentType}?api_key=${apiKey}&language=en-US&sort_by=${sortBy}&page=${currentPage}&include_adult=false`;
      
      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        setItems(prev => isNextPage ? [...prev, ...data.results] : data.results);
        setHasMore(data.page < data.total_pages);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [contentType, selectedGenre, sortBy, page]);

  useEffect(() => {
    fetchItems(false);
  }, [contentType, selectedGenre, sortBy]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchItems(true);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchItems, hasMore, loading]);

  const handleTypeChange = (type) => {
    if (type !== contentType) {
      setContentType(type);
      setSelectedGenre(null);
      setPage(1);
      setItems([]);
    }
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setPage(1);
    setItems([]);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(Page => 1);
    setItems([]);
  };

  return (
    <div className="home-page">
      {heroItem && (
        <section 
          className="hero-banner" 
          style={{ backgroundImage: `url(${TMDB_IMAGE_BASE_URL}original${heroItem.backdrop_path})` }}
        >
          <div className="hero-content">
            <h1>{heroItem.title || heroItem.name}</h1>
            <p>{heroItem.overview}</p>
          </div>
        </section>
      )}

      <div className="content-filters">
        <div className="type-toggle">
          <button 
            className={contentType === "movie" ? "active" : ""} 
            onClick={() => handleTypeChange("movie")}
          >
            🎬 Películas
          </button>
          <button 
            className={contentType === "tv" ? "active" : ""} 
            onClick={() => handleTypeChange("tv")}
          >
            📺 Series
          </button>
        </div>

        <div className="sort-filter">
          <label htmlFor="sort-select">Ordenar por:</label>
          <select id="sort-select" value={sortBy} onChange={handleSortChange}>
            <option value="popularity.desc">Más Populares</option>
            <option value="vote_average.desc">Mejor Valoradas</option>
            <option value="primary_release_date.desc">Más Recientes</option>
            <option value="revenue.desc">Más Taquilleras</option>
          </select>
        </div>
      </div>

      <GenreFilter 
        type={contentType} 
        onGenreSelect={handleGenreSelect} 
        selectedGenre={selectedGenre} 
      />

      <h2 className="section-title">
        {selectedGenre ? "Resultados Filtrados" : contentType === "movie" ? "Películas Populares" : "Series Populares"}
      </h2>

      <div className="movies-list">
        {isInitialLoad && items.length === 0 ? (
          Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          items.map((item) => (
            <MovieCard key={`${item.id}-${item.release_date || item.first_air_date}`} item={item} />
          ))
        )}
        
        {loading && !isInitialLoad && (
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={`more-${index}`} />
          ))
        )}
      </div>

      <div ref={loaderRef} className="infinite-loader">
        {hasMore && !loading && <p className="status-message">Cargando más contenido...</p>}
      </div>
    </div>
  );
}

export default HomePage;