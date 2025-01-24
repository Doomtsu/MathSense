import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Book, ChevronRight, ChevronDown } from 'lucide-react';
import type { Question } from '../types';

function Practice() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('category')
      .then(result => {
        if (result.data) {
          // Get unique categories
          const uniqueCategories = [...new Set(result.data.map(item => item.category))];
          return { data: uniqueCategories, error: result.error };
        }
        return result;
      });

    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', selectedCategory)
      .order('difficulty');

    if (!error && data) {
      setQuestions(data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Practice Mode</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select a Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedCategory === category
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-900 dark:text-white">{category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedQuestion(
                  expandedQuestion === question.id ? null : question.id
                )}
                className="w-full p-4 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    {
                      easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                      hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
                      expert: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }[question.difficulty]
                  }`}>
                    {question.difficulty}
                  </span>
                  <span className="text-gray-900 dark:text-white">{question.question}</span>
                </div>
                {expandedQuestion === question.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedQuestion === question.id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Answer:</h3>
                    <p className="text-gray-600 dark:text-gray-300">{question.correct_answer}</p>
                  </div>
                  {question.explanation && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Explanation:</h3>
                      <p className="text-gray-600 dark:text-gray-300">{question.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Practice;