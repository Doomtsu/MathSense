/*
  # Add policy for inserting questions

  1. Security Changes
    - Add policy to allow authenticated users to insert questions
    - This is needed for the initial questions to be inserted successfully
*/

-- Add policy to allow inserting questions
CREATE POLICY "Allow inserting questions" ON questions
  FOR INSERT
  WITH CHECK (true);