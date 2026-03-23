import React from 'react';
import './MovieCard.css';

function SkeletonCard() {
  return (
    <div className="movie-card skeleton-card" aria-hidden="true">
      <div className="movie-card-image-wrapper skeleton-img" />
      <div className="movie-card-info">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-rating" />
        <div className="skeleton-line skeleton-year" />
      </div>
    </div>
  );
}

export default SkeletonCard;
