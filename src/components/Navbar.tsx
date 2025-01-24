import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Trophy, BookOpen, User, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">MathSense</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/quiz" className="nav-link">
              <Brain className="w-5 h-5" />
              <span>Quiz</span>
            </Link>
            <Link to="/daily-challenge" className="nav-link">
              <Sparkles className="w-5 h-5" />
              <span>Daily</span>
            </Link>
            <Link to="/practice" className="nav-link">
              <BookOpen className="w-5 h-5" />
              <span>Practice</span>
            </Link>
            <Link to="/leaderboard" className="nav-link">
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;