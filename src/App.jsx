import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import TvShowDetailsPage from "./pages/TvShowDetailsPage";
import PersonDetailsPage from "./pages/PersonDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchlistPage from "./pages/WatchlistPage";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop"; // Changed from ScrollToTop
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <div className="App">
            <Header />
            <div className="main-content-wrapper">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/tv/:id" element={<TvShowDetailsPage />} />
                <Route path="/person/:id" element={<PersonDetailsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
              </Routes>
            </div>
            <Footer />
            <BackToTop />
          </div>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
