import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Clock } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  display_name: string;
  score: number;
  total_time?: number;
}

function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all_time'>('daily');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leaderboards')
      .select(`
        score,
        users (
          username,
          display_name
        )
      `)
      .eq('type', timeframe)
      .order('score', { ascending: false })
      .limit(10);

    if (!error && data) {
      setEntries(data.map(entry => ({
        username: entry.users.username,
        display_name: entry.users.display_name || entry.users.username,
        score: entry.score,
        total_time: entry.total_time
      })));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Leaderboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTimeframe('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              timeframe === 'daily'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Clock className="w-5 h-5" />
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              timeframe === 'weekly'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Medal className="w-5 h-5" />
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('all_time')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              timeframe === 'all_time'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Trophy className="w-5 h-5" />
            All Time
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry.username}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex-shrink-0 w-8 text-center">
                  {index === 0 ? (
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Trophy className="w-6 h-6 text-gray-400" />
                  ) : index === 2 ? (
                    <Trophy className="w-6 h-6 text-amber-600" />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400 font-mono">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {entry.display_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{entry.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {entry.score}
                  </p>
                  {entry.total_time && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.total_time}s
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;