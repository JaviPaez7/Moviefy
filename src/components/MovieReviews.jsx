import React, { useState, useEffect } from 'react';
import './MovieReviews.css';

function MovieReviews({ type, id }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        setReviews(data.results ? data.results.slice(0, 3) : []); // Top 3 reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [type, id]);

  if (loading) return <div className="reviews-loading">Cargando reseñas...</div>;
  if (reviews.length === 0) return null;

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Reseñas de Usuarios</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">
                {review.author_details.avatar_path ? (
                  <img 
                    src={review.author_details.avatar_path.startsWith('/http') 
                      ? review.author_details.avatar_path.substring(1) 
                      : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`} 
                    alt={review.author} 
                  />
                ) : (
                  <div className="avatar-placeholder">{review.author.charAt(0)}</div>
                )}
              </div>
              <div className="reviewer-info">
                <p className="reviewer-name">{review.author}</p>
                {review.author_details.rating && (
                  <div className="review-rating">
                    <span className="star">⭐</span>
                    <span className="rating-value">{review.author_details.rating}/10</span>
                  </div>
                )}
              </div>
            </div>
            <div className="review-content">
              <p>{review.content.length > 300 ? `${review.content.substring(0, 300)}...` : review.content}</p>
              {review.content.length > 300 && (
                <a href={review.url} target="_blank" rel="noopener noreferrer" className="read-more">Leer más</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieReviews;
