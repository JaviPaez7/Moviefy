import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // --- FAVORITOS ---
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // --- WATCHLIST (Ver más tarde) ---
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Lógica de Favoritos
  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const isAlreadyFav = prev.find((fav) => fav.id === item.id);
      if (isAlreadyFav) {
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  // Lógica de Watchlist
  const toggleWatchlist = (item) => {
    setWatchlist((prev) => {
      const isAlreadyAdded = prev.find((w) => w.id === item.id);
      if (isAlreadyAdded) {
        return prev.filter((w) => w.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isInWatchlist = (id) => watchlist.some((w) => w.id === id);

  return (
    <UserContext.Provider value={{ 
      favorites, toggleFavorite, isFavorite,
      watchlist, toggleWatchlist, isInWatchlist
    }}>
      {children}
    </UserContext.Provider>
  );
};
