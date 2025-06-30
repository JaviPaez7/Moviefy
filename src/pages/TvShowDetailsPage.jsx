import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Puedes reutilizar el mismo CSS de detalles de película si las clases son genéricas (.backdrop, .details-content, etc.)
// Si quieres estilos específicos para series, crea TvShowDetailsPage.css e impórtalo.
import './MovieDetailsPage.css'; // Reutilizamos el CSS de detalles de película por ahora

// URL base para las imágenes de TMDB (igual que antes)
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const BACKDROP_SIZE = 'original';
const POSTER_SIZE = 'w500';

// Este componente mostrará detalles de una Serie de Televisión
function TvShowDetailsPage() { // Cambia el nombre del componente
  // Obtiene el parámetro 'id' de la URL (definido en App.jsx como /tv/:id)
  const { id } = useParams();

  // Estado para los detalles de la serie, carga y error
  const [tvShowDetails, setTvShowDetails] = useState(null); // Cambia el nombre del estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    // --- MODIFICAR: URL de la API para obtener detalles de una SERIE específica por ID ---
    // Cambia '/movie/' por '/tv/'
    const API_URL = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`; // Ajusta el lenguaje si quieres

    console.log("Realizando llamada a la API para detalles de serie:", API_URL);

    const fetchTvShowDetails = async () => { // Cambia el nombre de la función
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          if (response.status === 404) {
             throw new Error("Serie no encontrada."); // Mensaje específico
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Detalles de serie recibidos:", data); // Log específico
        setTvShowDetails(data); // Guarda los detalles en el estado correcto
        setLoading(false);

      } catch (error) {
        console.error("Error al obtener detalles de la serie:", error); // Log específico
        setError(error.message || "No se pudieron cargar los detalles de la serie."); // Mensaje específico
        setLoading(false);
      }
    };

    if (id) {
      fetchTvShowDetails(); // Llama a la función
    } else {
       setError("ID de serie no proporcionado.");
       setLoading(false);
    }

  }, [id]); // Este efecto se re-ejecutará si el 'id' cambia

  // Renderizado condicional
  if (loading) {
    return <div>Cargando detalles de la serie...</div>; // Mensaje específico
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!tvShowDetails) { // Verifica el estado correcto
      return <div>No se encontraron datos para esta serie.</div>; // Mensaje específico
  }


  // --- MODIFICAR: Mostrar los detalles de la SERIE ---
  // Los nombres de las propiedades son diferentes
  return (
    <div className="movie-details-page"> {/* Puedes mantener la clase CSS si los estilos son genéricos */}
      {tvShowDetails.backdrop_path && (
          <div className="backdrop" style={{
              backgroundImage: `url(${TMDB_IMAGE_BASE_URL}${BACKDROP_SIZE}${tvShowDetails.backdrop_path})`, // Usa tvShowDetails
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '400px',
              position: 'relative',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '20px'
          }}>
          </div>
      )}

      <div className="details-content" style={{ padding: '20px' }}>
         {!tvShowDetails.backdrop_path && tvShowDetails.poster_path && (
              <img
                src={`${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${tvShowDetails.poster_path}`} // Usa tvShowDetails
                alt={`Poster of ${tvShowDetails.name}`} // USA .name para el título de la serie
                style={{ float: 'left', marginRight: '20px', marginBottom: '20px', width: '200px' }}
              />
         )}

        {/* --- PROPIEDADES ESPECÍFICAS DE SERIE --- */}
        <h1>{tvShowDetails.name}</h1> {/* USA .name para el título */}
        <p><strong>Rating:</strong> {tvShowDetails.vote_average ? tvShowDetails.vote_average.toFixed(1) : 'N/A'}</p>
        <p><strong>Fecha de Primera Emisión:</strong> {tvShowDetails.first_air_date || 'N/A'}</p> {/* USA .first_air_date */}
        <p><strong>Número de Temporadas:</strong> {tvShowDetails.number_of_seasons || 'N/A'}</p> {/* Propiedad de Serie */}
        <p><strong>Número de Episodios:</strong> {tvShowDetails.number_of_episodes || 'N/A'}</p> {/* Propiedad de Serie */}
         {tvShowDetails.episode_run_time && tvShowDetails.episode_run_time.length > 0 && (
             <p><strong>Duración Promedio del Episodio:</strong> {tvShowDetails.episode_run_time[0]} minutos</p> 
         )}


        <p><strong>Sinopsis:</strong> {tvShowDetails.overview || 'Sin sinopsis disponible.'}</p> {/* overview es igual */}


        {tvShowDetails.genres && tvShowDetails.genres.length > 0 && (
            <p><strong>Géneros:</strong> {tvShowDetails.genres.map(genre => genre.name).join(', ')}</p> 
        )}

         {tvShowDetails.networks && tvShowDetails.networks.length > 0 && (
             <p><strong>Cadenas:</strong> {tvShowDetails.networks.map(network => network.name).join(', ')}</p> 
         )}


         <div style={{ clear: 'both' }}></div>
      </div>
    </div>
  );
}

export default TvShowDetailsPage; // Exporta el componente con el nuevo nombre