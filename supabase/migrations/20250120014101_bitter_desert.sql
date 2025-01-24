/*
  # Initial Schema for Math Quiz App

  1. New Tables
    - `users`
      - Extended user profile data
      - Tracks user preferences and stats
    - `questions`
      - Stores math problems
      - Includes difficulty, category, and solution
    - `quiz_attempts`
      - Records user quiz attempts
      - Tracks timing and performance
    - `achievements`
      - Defines available achievements
    - `user_achievements`
      - Links users to earned achievements
    - `leaderboards`
      - Stores daily and all-time high scores

  2. Security
    - Enable RLS on all tables
    - Add policies for secure data access
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  display_name text,
  total_solved int DEFAULT 0,
  accuracy_rate float DEFAULT 0,
  average_time float DEFAULT 0,
  dark_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  difficulty text NOT NULL,
  question text NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now(),
  CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert'))
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  total_questions int NOT NULL,
  correct_answers int DEFAULT 0,
  total_time float,
  category text,
  difficulty text
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value int NOT NULL
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  achievement_id uuid REFERENCES achievements(id),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  score int NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (type IN ('daily', 'weekly', 'all_time'))
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read questions" ON questions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read own quiz attempts" ON quiz_attempts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quiz attempts" ON quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read achievements" ON achievements
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read own achievements" ON user_achievements
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read leaderboards" ON leaderboards
  FOR SELECT TO authenticated
  USING (true);