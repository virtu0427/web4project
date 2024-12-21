import React, { useState, useCallback, useRef } from 'react';
import { useWishlist } from '../context/WishlistContext';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import ViewToggle from '../components/ViewToggle';

const ITEMS_PER_PAGE = 12;

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const [page, setPage] = useState(1);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const hasMore = page < totalPages;

  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || !isInfiniteScroll) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, isInfiniteScroll]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleView = () => {
    setIsInfiniteScroll(!isInfiniteScroll);
    setPage(1);
  };

  const getDisplayedMovies = () => {
    if (isInfiniteScroll) {
      return wishlist.slice(0, page * ITEMS_PER_PAGE);
    } else {
      const start = (page - 1) * ITEMS_PER_PAGE;
      return wishlist.slice(start, start + ITEMS_PER_PAGE);
    }
  };

  const displayedMovies = getDisplayedMovies();

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">내 위시리스트</h1>
          {wishlist.length > 0 && (
            <ViewToggle isInfiniteScroll={isInfiniteScroll} onToggle={toggleView} />
          )}
        </div>

        {wishlist.length > 0 ? (
          <>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
              {displayedMovies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  ref={
                    isInfiniteScroll && index === displayedMovies.length - 1
                      ? lastMovieElementRef
                      : null
                  }
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {!isInfiniteScroll && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center text-gray-300">
            위시리스트가 비어있습니다. 마음에 드는 영화를 추가해보세요!
          </div>
        )}
      </div>
    </div>
  );
}