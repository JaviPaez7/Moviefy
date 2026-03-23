import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import MovieCard from '../components/MovieCard';

function WatchlistPage() {
  const { watchlist } = useContext(UserContext);

  return (
    <div className="favorites-page">
      <h1>Mi Lista de Seguimiento (Ver más tarde)</h1>
      
      {watchlist.length === 0 ? (
        <div className="status-message">
          <p>Tu lista está vacía. ¡Añade lo que quieras ver más tarde!</p>
        </div>
      ) : (
        <div className="movies-list">
          {watchlist.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistPage;
