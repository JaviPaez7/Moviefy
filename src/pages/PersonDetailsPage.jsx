import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './PersonDetailsPage.css';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const PROFILE_SIZE = 'h632';

function PersonDetailsPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3/person/';

    const fetchPersonData = async () => {
      setLoading(true);
      try {
        // Person Details
        const personRes = await fetch(`${baseUrl}${id}?api_key=${apiKey}&language=en-US`);
        if (!personRes.ok) throw new Error('Actor no encontrado.');
        const personData = await personRes.json();
        setPerson(personData);

        // Combined Credits (Movies & TV)
        const creditsRes = await fetch(`${baseUrl}${id}/combined_credits?api_key=${apiKey}&language=en-US`);
        const creditsData = await creditsRes.json();
        
        // Ordenamos por popularidad y tomamos los top 20
        const sortedCredits = creditsData.cast
          ? creditsData.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 20)
          : [];
        setCredits(sortedCredits);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching person data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) fetchPersonData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="status-message">Cargando perfil del actor...</div>;
  if (error) return <div className="status-message error-message">Error: {error}</div>;
  if (!person) return null;

  return (
    <div className="person-details-page">
      <div className="person-header">
        <div className="person-profile-img">
          {person.profile_path ? (
            <img 
              src={`${TMDB_IMAGE_BASE_URL}${PROFILE_SIZE}${person.profile_path}`} 
              alt={person.name} 
            />
          ) : (
            <div className="no-profile-placeholder">👤</div>
          )}
        </div>
        <div className="person-main-info">
          <h1>{person.name}</h1>
          <div className="person-meta">
            {person.birthday && <p><strong>Nacimiento:</strong> {person.birthday}</p>}
            {person.place_of_birth && <p><strong>Lugar:</strong> {person.place_of_birth}</p>}
            {person.known_for_department && <p><strong>Conocido por:</strong> {person.known_for_department}</p>}
          </div>
          {person.biography && (
            <div className="person-bio">
              <h2>Biografía</h2>
              <p>{person.biography}</p>
            </div>
          )}
        </div>
      </div>

      <div className="person-credits-section">
        <h2>Filmografía Destacada</h2>
        <div className="person-credits-grid">
          {credits.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PersonDetailsPage;
