import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, Clock } from 'lucide-react';
import { searchMovies, getGenres } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import ViewToggle from '../components/ViewToggle';
import GenreFilter from '../components/GenreFilter';
import { Movie, Genre } from '../types/movie';
import { useAuth } from '../context/AuthContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(true);
  const { currentUser } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const history = localStorage.getItem(`searchHistory_${currentUser.email}`);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, [currentUser]);

  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || !isInfiniteScroll || !query) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, isInfiniteScroll, query]);

  const addToSearchHistory = (searchQuery: string) => {
    if (currentUser) {
      const updatedHistory = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem(`searchHistory_${currentUser.email}`, JSON.stringify(updatedHistory));
    }
  };

  const performSearch = async (searchQuery: string, pageNum: number, append: boolean = false) => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await searchMovies(searchQuery, pageNum, selectedGenre?.id);
      setTotalPages(response.data.total_pages);
      
      if (append) {
        setMovies(prev => {
          const newMovies = response.data.results;
          const uniqueMovies = [...prev, ...newMovies].filter(
            (movie, index, self) => 
              index === self.findIndex(m => m.id === movie.id)
          );
          return uniqueMovies;
        });
      } else {
        setMovies(response.data.results);
      }
      
      setHasMore(response.data.results.length > 0);
      
      if (pageNum === 1) {
        addToSearchHistory(searchQuery.trim());
      }
    } catch (error) {
      setError('영화 검색에 실패했습니다. 다시 시도해주세요.');
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    await performSearch(query, 1, false);
  };

  const handleGenreSelect = (genre: Genre | null) => {
    setSelectedGenre(genre);
    setPage(1);
    if (query) {
      performSearch(query, 1, false);
    }
  };

  useEffect(() => {
    if (query && page > 1) {
      performSearch(query, page, isInfiniteScroll);
    }
  }, [page]);

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setPage(1);
    performSearch(historyQuery, 1, false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleView = () => {
    setIsInfiniteScroll(!isInfiniteScroll);
    if (query) {
      setPage(1);
      setMovies([]);
      performSearch(query, 1, false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="영화 검색..."
                className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? '검색 중...' : '검색'}
            </button>
          </form>

          {searchHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                최근 검색어
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyQuery)}
                    className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700"
                  >
                    {historyQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-center text-red-400 mb-8">
            {error}
          </div>
        )}

        {genres.length > 0 && (
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreSelect={handleGenreSelect}
          />
        )}

        {query && (
          <div className="flex justify-end mb-4">
            <ViewToggle isInfiniteScroll={isInfiniteScroll} onToggle={toggleView} />
          </div>
        )}

        {isLoading && movies.length === 0 && (
          <div className="text-center text-gray-300">
            검색 중...
          </div>
        )}

        {!isLoading && movies.length > 0 && (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
            {movies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                ref={
                  isInfiniteScroll && index === movies.length - 1
                    ? lastMovieElementRef
                    : null
                }
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

        {isLoading && movies.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {!isInfiniteScroll && !isLoading && movies.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {!isLoading && query && movies.length === 0 && !error && (
          <div className="text-center text-gray-300">
            "{query}"에 대한 검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}