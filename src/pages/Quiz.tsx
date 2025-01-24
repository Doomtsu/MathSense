import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateQuestions } from '../lib/groq';
import { fallbackQuestions } from '../lib/fallbackQuestions';
import { Timer, CheckCircle, XCircle, Sparkles, Brain, BookOpen } from 'lucide-react';
import type { Question } from '../types';
import { useAuth } from '../hooks/useAuth';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

const COURSES = [
  'Algebra 1',
  'Geometry',
  'Algebra 2',
  'Pre-Calculus',
  'Calculus',
  'Statistics'
] as const;

type Course = typeof COURSES[number];

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [selectedCourses, setSelectedCourses] = useState<Set<Course>>(new Set(['Algebra 1']));
  const { user } = useAuth();

  // Reset quiz state when navigating back to settings
  useEffect(() => {
    if (location.pathname === '/quiz') {
      setQuestions([]);
      setCurrentIndex(0);
      setUserAnswer('');
      setScore(0);
      setTimeLeft(60);
      setIsQuizActive(false);
      setShowResults(false);
      setError(null);
    }
  }, [location]);

  useEffect(() => {
    if (isQuizActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isQuizActive) {
      endQuiz();
    }
  }, [timeLeft, isQuizActive]);

  const toggleCourse = (course: Course) => {
    const newCourses = new Set(selectedCourses);
    if (newCourses.has(course)) {
      newCourses.delete(course);
    } else {
      newCourses.add(course);
    }
    setSelectedCourses(newCourses);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = async () => {
    if (selectedCourses.size === 0) {
      setError('Please select at least one course');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let quizQuestions: Question[] = [];

      if (useAI) {
        try {
          const generatedQuestions = await generateQuestions(
            10,
            selectedDifficulty,
            Array.from(selectedCourses)
          );
          if (generatedQuestions && generatedQuestions.length > 0) {
            quizQuestions = generatedQuestions.map((q, index) => ({
              ...q,
              id: `generated-${index}`
            }));
          }
        } catch (groqError) {
          console.log('Failed to generate AI questions, falling back to database');
          setError('AI generation failed. Using standard questions instead.');
          setUseAI(false);
        }
      }

      if (quizQuestions.length === 0) {
        const { data: dbQuestions, error: dbError } = await supabase
          .from('questions')
          .select('*')
          .eq('difficulty', selectedDifficulty)
          .in('course', Array.from(selectedCourses));

        if (!dbError && dbQuestions && dbQuestions.length > 0) {
          quizQuestions = shuffleArray(dbQuestions).slice(0, 10);
        } else {
          console.log('Using fallback questions');
          quizQuestions = fallbackQuestions.filter(
            q => q.difficulty === selectedDifficulty && 
            selectedCourses.has(q.course as Course)
          );
        }
      }

      if (quizQuestions.length === 0) {
        throw new Error('No questions available for the selected options. Please try different selections.');
      }

      setQuestions(shuffleArray(quizQuestions));
      setCurrentIndex(0);
      setScore(0);
      setTimeLeft(60);
      setIsQuizActive(true);
      setShowResults(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(error instanceof Error ? error.message : 'Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    const isCorrect = userAnswer.trim().toLowerCase() === 
      currentQuestion.correct_answer.toLowerCase();
    
    if (isCorrect) setScore(score + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    setIsQuizActive(false);
    setShowResults(true);

    if (user) {
      const attemptData = {
        user_id: user.id,
        total_questions: questions.length,
        correct_answers: score,
        total_time: 60 - timeLeft,
        difficulty: selectedDifficulty,
        courses: Array.from(selectedCourses)
      };

      await supabase.from('quiz_attempts').insert([attemptData]);
    }
  };

  const returnToSettings = () => {
    setIsQuizActive(false);
    setShowResults(false);
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setScore(0);
    setTimeLeft(60);
    setError(null);
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      expert: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[difficulty];
  };

  if (!isQuizActive && !showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Math Quiz</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ready to Test Your Skills?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You'll have 60 seconds to answer 10 questions. Good luck!
          </p>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select Courses</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COURSES.map((course) => (
                <button
                  key={course}
                  onClick={() => toggleCourse(course)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    selectedCourses.has(course)
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-500'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{course}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select Difficulty</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['easy', 'medium', 'hard', 'expert'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    selectedDifficulty === difficulty
                      ? `${getDifficultyColor(difficulty)} border-current`
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span className="capitalize">{difficulty}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Use AI-generated questions
            </label>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          <button 
            onClick={startQuiz} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading Questions...' : 'Start Quiz'}
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Quiz Results</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Score: {score}/{questions.length}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedDifficulty)}`}>
                <Brain className="w-4 h-4 mr-1" />
                {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
              </span>
              {Array.from(selectedCourses).map(course => (
                <span key={course} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course}
                </span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Time taken: {60 - timeLeft} seconds
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={startQuiz} 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Loading Questions...' : 'Try Again'}
              </button>
              <button
                onClick={returnToSettings}
                className="btn-secondary"
              >
                Change Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Question {currentIndex + 1}/{questions.length}</h1>
        <div className="flex items-center gap-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedDifficulty)}`}>
            <Brain className="w-4 h-4 mr-1" />
            {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
          </span>
          {currentQuestion.course && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
              <BookOpen className="w-4 h-4 mr-1" />
              {currentQuestion.course}
            </span>
          )}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-xl">{timeLeft}s</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-xl text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
    </div>
  );
}

export default Quiz;