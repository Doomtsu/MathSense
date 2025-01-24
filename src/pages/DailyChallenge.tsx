import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { generateQuestions } from '../lib/groq';
import { Timer, Brain, Trophy, Medal } from 'lucide-react';

interface DailyStats {
  attempts: number;
  best_time?: number;
  solved_by: number;
}

function DailyChallenge() {
  const [question, setQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DailyStats>({ attempts: 0, solved_by: 0 });
  const { user } = useAuth();

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isActive) {
      handleSubmit();
    }
  }, [timeLeft, isActive]);

  const fetchDailyChallenge = async () => {
    try {
      // Check if we already have today's challenge
      const today = new Date().toISOString().split('T')[0];
      const { data: existingChallenge } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('date', today)
        .single();

      if (existingChallenge) {
        setQuestion(existingChallenge);
        const { data: statsData } = await supabase
          .from('daily_challenge_stats')
          .select('attempts, best_time, solved_by')
          .eq('challenge_id', existingChallenge.id)
          .single();
        
        if (statsData) {
          setStats(statsData);
        }
      } else {
        // Generate new challenge
        const questions = await generateQuestions(1, 'expert');
        const newQuestion = questions[0];
        
        const { data: challenge } = await supabase
          .from('daily_challenges')
          .insert([{
            date: today,
            ...newQuestion,
            time_limit: 300
          }])
          .select()
          .single();

        if (challenge) {
          setQuestion(challenge);
          await supabase
            .from('daily_challenge_stats')
            .insert([{
              challenge_id: challenge.id,
              attempts: 0,
              solved_by: 0
            }]);
        }
      }
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      setError('Failed to load daily challenge');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startChallenge = () => {
    setIsActive(true);
    setTimeLeft(300);
    setUserAnswer('');
    setShowResults(false);
  };

  const handleSubmit = async () => {
    if (!question || !user) return;

    const timeTaken = 300 - timeLeft;
    const correct = userAnswer.trim().toLowerCase() === question.correct_answer.toLowerCase();
    setIsCorrect(correct);
    setShowResults(true);
    setIsActive(false);

    try {
      // Update stats
      const { data: currentStats } = await supabase
        .from('daily_challenge_stats')
        .select('*')
        .eq('challenge_id', question.id)
        .single();

      if (currentStats) {
        const updates: any = {
          attempts: currentStats.attempts + 1
        };

        if (correct) {
          updates.solved_by = currentStats.solved_by + 1;
          if (!currentStats.best_time || timeTaken < currentStats.best_time) {
            updates.best_time = timeTaken;
          }
        }

        await supabase
          .from('daily_challenge_stats')
          .update(updates)
          .eq('challenge_id', question.id);

        setStats(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
          solved_by: correct ? prev.solved_by + 1 : prev.solved_by,
          best_time: correct && (!prev.best_time || timeTaken < prev.best_time) 
            ? timeTaken 
            : prev.best_time
        }));
      }

      // Record user attempt
      await supabase
        .from('daily_challenge_attempts')
        .insert([{
          challenge_id: question.id,
          user_id: user.id,
          time_taken: timeTaken,
          is_correct: correct
        }]);
    } catch (error) {
      console.error('Error updating challenge stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Daily Challenge</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {!isActive && !showResults ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Today's Advanced Mathematics Challenge
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You'll have 5 minutes to solve this advanced mathematics problem. Good luck!
                </p>
                <button 
                  onClick={startChallenge}
                  className="btn-primary"
                >
                  Start Challenge
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    <Brain className="w-4 h-4 mr-1" />
                    Expert
                  </span>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Timer className="w-5 h-5" />
                    <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                
                <p className="text-xl text-gray-900 dark:text-white mb-6">
                  {question?.question}
                </p>

                {showResults ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${
                      isCorrect 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                      <h3 className="font-semibold mb-2">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p>Answer: {question?.correct_answer}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Explanation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {question?.explanation}
                      </p>
                    </div>
                    <button
                      onClick={startChallenge}
                      className="btn-primary w-full"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="input-field dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your answer"
                      autoFocus
                    />
                    <button type="submit" className="btn-primary w-full">
                      Submit Answer
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Today's Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Medal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Solved By</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.solved_by} users
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Attempts</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.attempts}
                  </div>
                </div>
              </div>
              {stats.best_time && (
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Best Time</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatTime(stats.best_time)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyChallenge;