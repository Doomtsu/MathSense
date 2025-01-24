/*
  # Add initial math questions

  1. New Data
    - Adds initial set of math questions across different categories and difficulty levels
  
  2. Categories
    - Mental Math
    - Number Properties
    - Algebra
    - Geometry
*/

INSERT INTO questions (category, difficulty, question, correct_answer, explanation)
VALUES
  -- Mental Math
  ('Mental Math', 'easy', 'What is 15 × 12?', '180', 'Break it down: (15 × 10) + (15 × 2) = 150 + 30 = 180'),
  ('Mental Math', 'medium', 'What is 25% of 160?', '40', 'To find 25%, divide by 4: 160 ÷ 4 = 40'),
  ('Mental Math', 'hard', 'What is 68 × 67?', '4556', 'Use (a+1)(a-1) pattern: 68 × 67 = (67+1)(67) = 67² + 67 = 4489 + 67 = 4556'),
  
  -- Number Properties
  ('Number Properties', 'easy', 'What is the sum of the first 10 positive integers?', '55', 'Use the formula n(n+1)/2 where n=10: 10(11)/2 = 55'),
  ('Number Properties', 'medium', 'How many factors does 72 have?', '12', 'Prime factorization: 72 = 2³ × 3². Number of factors = (3+1)(2+1) = 4 × 3 = 12'),
  ('Number Properties', 'hard', 'What is the remainder when 2⁵⁰ is divided by 7?', '4', 'Use cyclicity: 2¹ ≡ 2, 2² ≡ 4, 2³ ≡ 1 (mod 7). Since 50 ≡ 2 (mod 3), 2⁵⁰ ≡ 4 (mod 7)'),
  
  -- Algebra
  ('Algebra', 'easy', 'Solve for x: 3x + 5 = 20', '5', 'Subtract 5 from both sides: 3x = 15, then divide by 3: x = 5'),
  ('Algebra', 'medium', 'If x² + y² = 25 and xy = 12, what is x + y?', '7', 'Use (x+y)² = x² + 2xy + y² = 25 + 24 = 49, so x + y = 7'),
  ('Algebra', 'hard', 'For what value of k is x² + kx + 4 a perfect square?', '4', 'For perfect square, k²/4 = 4, so k = ±4. Since we want minimum, k = 4'),
  
  -- Geometry
  ('Geometry', 'easy', 'What is the area of a rectangle with length 8 and width 6?', '48', 'Area = length × width = 8 × 6 = 48'),
  ('Geometry', 'medium', 'In a right triangle, if one leg is 5 and the hypotenuse is 13, what is the other leg?', '12', 'Use Pythagorean theorem: 5² + x² = 13², so x = 12'),
  ('Geometry', 'hard', 'What is the area of a regular hexagon with side length 4?', '41.57', 'Area = (3√3/2) × s², where s = 4. Area ≈ 41.57');