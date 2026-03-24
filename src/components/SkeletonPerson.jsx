import React from 'react';
import './MovieCard.css';

function SkeletonPerson() {
  return (
    <div className="person-details-page skeleton-details">
      <div className="person-header" style={{ alignItems: 'flex-start' }}>
        <div className="person-profile-img">
          <div className="skeleton-img" style={{ width: '300px', height: '450px', borderRadius: '12px' }}></div>
        </div>
        <div className="person-main-info" style={{ flexGrow: 1, paddingLeft: '30px' }}>
          <div className="skeleton-text" style={{ width: '40%', height: '40px', marginBottom: '20px' }}></div>
          <div className="skeleton-text" style={{ width: '60%', height: '24px', marginBottom: '10px' }}></div>
          <div className="skeleton-text" style={{ width: '50%', height: '20px', marginBottom: '30px' }}></div>
          <div className="skeleton-text" style={{ width: '100%', height: '200px' }}></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonPerson;
