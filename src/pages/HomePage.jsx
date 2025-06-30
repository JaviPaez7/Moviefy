import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import './HomePage.css'; // Asegúrate de crear este archivo para los estilos
function HomePage() {
  // 1. Declara variables de estado
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true); // Estado de carga específico para películas
  const [moviesError, setMoviesError] = useState(null);   // Estado de error específico para películas

  // --- NUEVO Estado para Series ---
  const [tvShows, setTvShows] = useState([]);
  const [tvShowsLoading, setTvShowsLoading] = useState(true); // Estado de carga para series
  const [tvShowsError, setTvShowsError] = useState(null);   // Estado de error para series
  // --- Fin Nuevo Estado ---

  // 2. Usa useEffect para hacer la llamada API cuando el componente se monte
  useEffect(() => {
    // Obtén la clave API desde las variables de entorno
    const apiKey = import.meta.env.VITE_TMDB_API_KEY; // Asegúrate que el nombre coincida con tu archivo .env

    // URL de la API para películas populares
    // Reemplaza 'TU_CLAVE_API' con tu clave real (aunque la obtenemos de las variables de entorno)
    // La clave se pasa como parámetro de consulta 'api_key'
    const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    // Puedes cambiar 'language' a 'es-ES' si prefieres los títulos en español (si están disponibles)
    // Puedes cambiar 'page' si quieres cargar una página diferente

    console.log("Realizando llamada a la API:", API_URL); // Opcional: para verificar la URL

    // Función asíncrona para obtener los datos
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL); // Realiza la petición

        if (!response.ok) {
          // Si la respuesta no es exitosa (ej. 401, 404, 500) lanza un error
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parsea la respuesta JSON
        console.log("Datos recibidos de la API:", data); // Opcional: para ver la estructura de los datos

        // TMDB API devuelve los resultados en un array llamado 'results'
        setMovies(data.results); // Guarda la lista de películas en el estado
        setMoviesLoading(false); // La carga ha terminado
      } catch (error) {
        // Si ocurre un error durante la petición o el procesamiento
        console.error("Error al obtener las películas:", error);
        setMoviesError("No se pudieron cargar las películas. Inténtalo de nuevo más tarde."); // Guarda un mensaje de error
        setMoviesLoading(false); // La carga ha terminado (con error)
      }
    };

    // Llama a la función para obtener los datos
    fetchMovies();

  }, []); // El array vacío [] como segundo argumento asegura que este efecto se ejecute SÓLO una vez al montar el componente, como componentDidMount.

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const API_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`; // Endpoint para TV popular

    const fetchTvShows = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const data = await response.json();
        setTvShows(data.results);
        setTvShowsLoading(false);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setTvShowsError("No se pudieron cargar las series.");
        setTvShowsLoading(false);
      }
    };

    fetchTvShows();
  }, []);
  // 3. Renderizado condicional basado en el estado (loading, error, data)
  if (moviesLoading || tvShowsLoading) {
    return <div>Cargando contenido...</div>;
}


return (
  <div className="homepage">
    {/* Sección de Películas */}
    <h1>Popular Movies</h1>
    {moviesError && <div style={{ color: 'red' }}>Error al cargar películas: {moviesError}</div>}
    {!moviesLoading && !moviesError && movies.length === 0 && <div>No hay películas populares disponibles.</div>}

    <div className="movies-list"> {/* Reutilizamos la clase para el layout de cuadrícula */}
    {movies
  .filter(item => item != null) // <--- ¿Añadiste esto?
  .map(item => (
    <MovieCard key={item.id} item={item} />
  ))}
    </div>

    {/* --- NUEVA Sección de Series --- */}
    <h1>Series Populares</h1>
     {tvShowsError && <div style={{ color: 'red' }}>Error al cargar series: {tvShowsError}</div>}
     {!tvShowsLoading && !tvShowsError && tvShows.length === 0 && <div>No hay series populares disponibles.</div>}

    <div className="movies-list"> {/* Reutilizamos la misma clase para el layout de cuadrícula */}
    {tvShows
 .filter(item => item != null) // <--- ¿Añadiste esto también?
 .map(item => (
   <MovieCard key={item.id} item={item} />
 ))}
    </div>
    {/* --- Fin Nueva Sección --- */}

  </div>
);
}

export default HomePage;