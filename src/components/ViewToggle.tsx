import React from 'react';
import { List, Infinity } from 'lucide-react';

interface ViewToggleProps {
  isInfiniteScroll: boolean;
  onToggle: () => void;
}

export default function ViewToggle({ isInfiniteScroll, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center justify-end mb-4">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700"
      >
        {isInfiniteScroll ? (
          <>
            <Infinity className="w-4 h-4" />
            <span>무한스크롤</span>
          </>
        ) : (
          <>
            <List className="w-4 h-4" />
            <span>페이징</span>
          </>
        )}
      </button>
    </div>
  );
}