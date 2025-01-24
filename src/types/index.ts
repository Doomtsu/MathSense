export interface User {
  id: string;
  username: string;
  display_name?: string;
  total_solved: number;
  accuracy_rate: number;
  average_time: number;
  dark_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  question: string;
  correct_answer: string;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  total_questions: number;
  correct_answers: number;
  total_time?: number;
  category?: string;
  difficulty?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  category: string;
  type: 'daily' | 'weekly' | 'all_time';
  created_at: string;
}