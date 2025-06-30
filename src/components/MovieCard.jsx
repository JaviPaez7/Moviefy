import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css'; // Asegúrate de tener este archivo y sus estilos

// URL base para las imágenes de TMDB
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w500'; // Tamaño común para pósters en listas

// Este componente ahora espera una prop llamada 'item', que puede ser una película o una serie
function MovieCard({ item }) {
  const navigate = useNavigate(); // Hook para la navegación programática

  // --- Lógica para determinar si es película o serie y obtener título/nombre ---
  // TMDB popular endpoints (/movie/popular, /tv/popular) no incluyen 'media_type'.
  // search/multi SÍ incluye 'media_type'.
  // Aquí usamos una asunción simple: si tiene 'title', es película; si tiene 'name', es serie.
  // Si usas search/multi más adelante, es más robusto usar item.media_type === 'movie'/'tv'.
  const mediaType = item.media_type ? item.media_type : (item.title !== undefined ? 'movie' : 'tv');

  const title = item.title || item.name; // Usa 'title' si existe, si no, usa 'name'
  // const releaseDate = item.release_date || item.first_air_date; // Puedes añadir esto si lo muestras
  // --- Fin Lógica ---

  // Construye la URL completa de la imagen del póster
  // Si item.poster_path es null o undefined, imageUrl será null/undefined
  const imageUrl = item.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}`
    : null; // Mejor que sea null si no hay path, para que el <img> no intente cargar una URL inválida

  // Función que se ejecuta al hacer clic en la tarjeta
  const handleCardClick = () => {
    // Navega a la ruta de detalles usando el mediaType detectado y el ID del item
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    // El contenedor principal de la tarjeta. Añade el manejador onClick.
    <div className="movie-card" onClick={handleCardClick}>
      {/* Muestra el póster si imageUrl existe, si no, muestra el div de placeholder */}
      {imageUrl ? (
        // Asegúrate de que este comentario NO está inmediatamente después del />
        <img
          src={imageUrl}
          alt={`Poster of ${title || 'N/A'}`} // Usa el título o 'N/A' para el alt
          // Puedes quitar este estilo inline si ya lo manejas en MovieCard.css para .movie-card img
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        // Este div se muestra si no hay póster. Asegúrate de que la clase 'no-poster'
        // tenga estilos definidos (fondo, altura, etc.) en MovieCard.css
        <div className="no-poster">No poster available</div>
      )}

      {/* Muestra el título o nombre */}
      {/* Este comentario aquí sí está bien */}
      <h3>{title || 'Título Desconocido'}</h3> {/* Usa el título o un texto por defecto */}

      {/* Otros detalles opcionales (ej. rating, fecha) */}
      {/* <p>Rating: {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p> */}

    </div>
  );
}

export default MovieCard;