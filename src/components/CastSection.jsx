import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CastSection.css';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const PROFILE_SIZE = 'w185';

function CastSection({ cast }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!cast || cast.length === 0) return null;

  const mainCast = cast.slice(0, 15);

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
  }, [mainCast]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="cast-section">
      <h2 className="cast-title">Reparto Principal</h2>
      
      <div className="cast-container">
        {showLeftArrow && (
          <button className="cast-arrow left" onClick={() => scroll('left')}>
            ‹
          </button>
        )}

        <div 
          className={`cast-scroll ${showLeftArrow ? 'can-scroll-left' : ''} ${showRightArrow ? 'can-scroll-right' : ''}`} 
          ref={scrollRef} 
          onScroll={handleScroll}
        >
          {mainCast.map((actor) => (
            <Link key={actor.id} to={`/person/${actor.id}`} className="cast-card">
              <div className="cast-image-wrapper">
                {actor.profile_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${PROFILE_SIZE}${actor.profile_path}`}
                    alt={actor.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-profile">
                    <span>{actor.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="cast-info">
                <p className="actor-name">{actor.name}</p>
                <p className="character-name">{actor.character}</p>
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button className="cast-arrow right" onClick={() => scroll('right')}>
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default CastSection;
