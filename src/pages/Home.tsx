import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Trophy } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to MathSense
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Challenge yourself with Number Sense UIL-style math problems
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/quiz" className="group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick Quiz</h2>
            <p className="text-gray-600 dark:text-gray-300">Test your skills with timed challenges</p>
          </div>
        </Link>

        <Link to="/practice" className="group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Practice Mode</h2>
            <p className="text-gray-600 dark:text-gray-300">Learn at your own pace with detailed explanations</p>
          </div>
        </Link>

        <Link to="/leaderboard" className="group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <Trophy className="w-12 h-12 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Leaderboard</h2>
            <p className="text-gray-600 dark:text-gray-300">Compare your scores with others</p>
          </div>
        </Link>
      </div>

      <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Daily Challenge</h2>
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <p className="text-lg text-gray-900 dark:text-white mb-4">
            Solve today's featured problem and compete with others!
          </p>
          <Link to="/quiz" className="btn-primary inline-block">
            Start Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;