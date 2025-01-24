import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { User, Award, Clock, Target } from 'lucide-react';

function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({ display_name: displayName })
      .eq('id', user.id);

    setSaving(false);
    if (!error) {
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-field dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user.display_name || user.username}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.total_solved}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Problems Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(user.accuracy_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.average_time.toFixed(1)}s
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Time</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Activity items would go here */}
              <p className="text-gray-600 dark:text-gray-300">No recent activity</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Score</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.total_solved * 100}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Time Spent</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(user.total_solved * user.average_time / 60).toFixed(1)} minutes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(user.accuracy_rate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Achievements
            </h2>
            <div className="space-y-4">
              {/* Achievement items would go here */}
              <p className="text-gray-600 dark:text-gray-300">No achievements yet</p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;