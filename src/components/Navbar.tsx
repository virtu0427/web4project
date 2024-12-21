import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, LogOut, Menu, X, Home, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/" : "/signin"} className="text-2xl font-bold text-indigo-400 hover:text-indigo-300">
              JoMovie
            </Link>
          </div>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-indigo-400 flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link to="/popular" className="text-gray-300 hover:text-indigo-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Popular</span>
              </Link>
              <Link to="/search" className="text-gray-300 hover:text-indigo-400 flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
              <Link to="/wishlist" className="text-gray-300 hover:text-indigo-400 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-indigo-400 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-indigo-400"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}

          {/* Sign In Link for Non-authenticated Users */}
          {!isAuthenticated && (
            <Link
              to="/signin"
              className="flex items-center text-indigo-400 hover:text-indigo-300"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && (
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-300 hover:text-indigo-400 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/popular"
                className="text-gray-300 hover:text-indigo-400 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Popular</span>
              </Link>
              <Link
                to="/search"
                className="text-gray-300 hover:text-indigo-400 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
              <Link
                to="/wishlist"
                className="text-gray-300 hover:text-indigo-400 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-indigo-400 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}