import React from 'react';
import { Genre } from '../types/movie';
import { X } from 'lucide-react';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: Genre | null;
  onGenreSelect: (genre: Genre | null) => void;
}

export default function GenreFilter({ genres, selectedGenre, onGenreSelect }: GenreFilterProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {selectedGenre ? (
          <button
            onClick={() => onGenreSelect(null)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
          >
            {selectedGenre.name}
            <X className="w-4 h-4" />
          </button>
        ) : (
          genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onGenreSelect(genre)}
              className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700"
            >
              {genre.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}