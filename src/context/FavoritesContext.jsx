import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '../hooks/useSoundEffects';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('zafaron_favorites_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('zafaron_favorites_v1', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (dish) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === dish.id);
      if (exists) {
        soundFx.playPop();
        return prev.filter((item) => item.id !== dish.id);
      } else {
        soundFx.playChime();
        return [...prev, dish];
      }
    });
  };

  const isFavorite = (dishId) => {
    return favorites.some((item) => item.id === dishId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      totalFavorites: favorites.length,
      isFavoritesOpen,
      setIsFavoritesOpen,
      openFavorites: () => setIsFavoritesOpen(true),
      closeFavorites: () => setIsFavoritesOpen(false),
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
