import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getPopularMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import ViewToggle from '../components/ViewToggle';
import { Movie } from '../types/movie';

export default function Popular() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

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

  const fetchPopularMovies = async (pageNum: number, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPopularMovies(pageNum);
      setTotalPages(response.data.total_pages);
      
      if (append) {
        setPopularMovies(prev => {
          const newMovies = response.data.results;
          const uniqueMovies = [...prev, ...newMovies].filter(
            (movie, index, self) => 
              index === self.findIndex(m => m.id === movie.id)
          );
          return uniqueMovies;
        });
      } else {
        setPopularMovies(response.data.results);
      }
      
      setHasMore(response.data.results.length > 0);
    } catch (error) {
      setError('인기 영화를 불러오는데 실패했습니다. 다시 시도해주세요.');
      console.error('Error fetching popular movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInfiniteScroll) {
      fetchPopularMovies(page, page > 1);
    } else {
      fetchPopularMovies(page, false);
    }
  }, [page, isInfiniteScroll]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleView = () => {
    setIsInfiniteScroll(!isInfiniteScroll);
    setPage(1);
    setPopularMovies([]);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-100">인기 영화</h1>
          <ViewToggle isInfiniteScroll={isInfiniteScroll} onToggle={toggleView} />
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
          {popularMovies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              ref={
                isInfiniteScroll && index === popularMovies.length - 1
                  ? lastMovieElementRef
                  : null
              }
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {!isInfiniteScroll && !isLoading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}