import React from 'react';
import { Heart } from 'lucide-react';
import { Movie } from '../types/movie';
import { useWishlist } from '../context/WishlistContext';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(movie.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  const formatRating = (rating: number): string => {
    return typeof rating === 'number' && !isNaN(rating) 
      ? rating.toFixed(1) 
      : 'N/A';
  };

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-transform hover:scale-105 border border-gray-700">
      <img
        src={movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image'}
        alt={movie.title}
        className="w-full h-[280px] object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/500x750?text=No+Image';
        }}
      />
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-1.5 bg-gray-900/80 rounded-full shadow-lg backdrop-blur-sm"
      >
        <Heart
          className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
        />
      </button>
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-1 text-gray-100 line-clamp-1">{movie.title}</h3>
        <p className="text-xs text-gray-400 mb-1">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
        <div className="flex items-center mb-1">
          <span className="text-yellow-500 text-xs">★</span>
          <span className="ml-1 text-gray-300 text-xs">{formatRating(movie.vote_average)}</span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2">
          {movie.overview || '설명이 없습니다.'}
        </p>
      </div>
    </div>
  );
}