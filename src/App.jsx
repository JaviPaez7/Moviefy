import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Importa el Header
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import SearchResultsPage from "./pages/SearchResultsPage"; // Importa la página de resultados
import TvShowDetailsPage from "./pages/TvShowDetailsPage";
import FavoritesPage from "./pages/FavoritesPage"; // Nueva página
import Footer from "./components/Footer";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./App.css"; // Asegúrate de tener un archivo CSS para estilizar la App

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="App">
          <Header /> {/* El Header se muestra en todas las rutas */}
          <div className="main-content-wrapper">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              {/* Nueva ruta para los resultados de búsqueda */}
              <Route path="/search" element={<SearchResultsPage />} />
              {/* Ruta de favoritos */}
              <Route path="/favorites" element={<FavoritesPage />} />
              {/* Aquí añadirías otras rutas, ej. /tv/:id si añades series */}
              <Route path="/tv/:id" element={<TvShowDetailsPage />} />
            </Routes>
          </div>
          <Footer /> {/* El Footer se muestra en todas las rutas */}
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;
