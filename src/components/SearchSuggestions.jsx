import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchSuggestions.css';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w92';

function SearchSuggestions({ suggestions, onSelect, isVisible }) {
  const navigate = useNavigate();

  if (!isVisible || suggestions.length === 0) return null;

  const handleSelect = (item) => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    navigate(`/${type}/${item.id}`);
    onSelect();
  };

  return (
    <div className="search-suggestions-container">
      {suggestions.map((item) => (
        <div 
          key={item.id} 
          className="suggestion-item"
          onClick={() => handleSelect(item)}
        >
          <div className="suggestion-poster">
            { (item.poster_path || item.profile_path) ? (
              <img 
                src={`${TMDB_IMAGE_BASE_URL}${item.poster_path || item.profile_path}`} 
                alt={item.title || item.name} 
              />
            ) : (
              <div className="no-poster-suggestion">
                {item.media_type === 'person' ? '👤' : '🎬'}
              </div>
            )}
          </div>
          <div className="suggestion-info">
            <p className="suggestion-title">{item.title || item.name}</p>
            <p className="suggestion-subtitle">
              {item.media_type === 'person' ? (
                `Actor • ${item.known_for_department || ''}`
              ) : (
                <>
                  {item.release_date || item.first_air_date ? (item.release_date || item.first_air_date).split('-')[0] : 'N/A'}
                  {' • '}
                  {item.media_type === 'tv' ? 'Serie' : 'Película'}
                </>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchSuggestions;
