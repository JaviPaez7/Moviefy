import React, { useState, useEffect, useRef } from 'react';
import './GenreFilter.css';

function GenreFilter({ type: contentType, selectedGenre, onGenreSelect }) {
  const [genres, setGenres] = useState([]);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const API_URL = `https://api.themoviedb.org/3/genre/${contentType}/list?api_key=${apiKey}&language=es-ES`;

    const fetchGenres = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [contentType]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      setTimeout(handleScroll, 500);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [genres]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="genre-filter-container">
      {showLeftArrow && (
        <button className="scroll-arrow left" onClick={() => scroll('left')}>
          ‹
        </button>
      )}
      
      <div 
        className={`genre-filter ${showLeftArrow ? 'can-scroll-left' : ''} ${showRightArrow ? 'can-scroll-right' : ''}`} 
        ref={scrollRef} 
        onScroll={handleScroll}
      >
        <button
          className={`genre-chip ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => onGenreSelect(null)}
        >
          Todos
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => onGenreSelect(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button className="scroll-arrow right" onClick={() => scroll('right')}>
          ›
        </button>
      )}
    </div>
  );
}

export default GenreFilter;
