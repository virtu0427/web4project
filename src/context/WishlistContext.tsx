import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types/movie';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Movie[];
  addToWishlist: (movie: Movie) => void;
  removeFromWishlist: (movieId: number) => void;
  isInWishlist: (movieId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Movie[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const storedWishlist = localStorage.getItem(`wishlist_${currentUser.email}`);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    }
  }, [currentUser]);

  const addToWishlist = (movie: Movie) => {
    const updatedWishlist = [...wishlist, movie];
    setWishlist(updatedWishlist);
    if (currentUser) {
      localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updatedWishlist));
    }
  };

  const removeFromWishlist = (movieId: number) => {
    const updatedWishlist = wishlist.filter((movie) => movie.id !== movieId);
    setWishlist(updatedWishlist);
    if (currentUser) {
      localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updatedWishlist));
    }
  };

  const isInWishlist = (movieId: number) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}