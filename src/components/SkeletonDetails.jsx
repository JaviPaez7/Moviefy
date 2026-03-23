import React from 'react';
import './MovieCard.css'; // Reusing existing skeleton styles

function SkeletonDetails() {
  return (
    <div className="movie-details-page skeleton-details">
      <div className="backdrop skeleton-img" style={{ height: '400px' }}></div>
      <div className="details-content" style={{ marginTop: '-100px' }}>
        <div className="details-content-poster">
          <div className="skeleton-img" style={{ width: '300px', height: '450px' }}></div>
        </div>
        <div className="details-content-info" style={{ flexGrow: 1 }}>
          <div className="skeleton-text" style={{ width: '60%', height: '40px', marginBottom: '20px' }}></div>
          <div className="skeleton-text" style={{ width: '40%', height: '24px', marginBottom: '30px' }}></div>
          <div className="skeleton-text" style={{ width: '100%', height: '100px', marginBottom: '20px' }}></div>
          <div className="skeleton-text" style={{ width: '80%', height: '20px', marginBottom: '10px' }}></div>
          <div className="skeleton-text" style={{ width: '70%', height: '20px', marginBottom: '10px' }}></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonDetails;
