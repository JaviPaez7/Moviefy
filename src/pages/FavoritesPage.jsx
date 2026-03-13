import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import './HomePage.css'; // Reusing layout css

function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="homepage">
      <h1>Tus Favoritos</h1>
      
      {favorites.length === 0 ? (
        <div className="status-message">
          No tienes ninguna película en favoritos aún.
        </div>
      ) : (
        <div className="movies-list">
          {favorites.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
