export const fallbackQuestions = [
  {
    id: '1',
    category: 'Mental Math',
    difficulty: 'easy',
    question: 'What is 15 × 12?',
    correct_answer: '180',
    explanation: 'Break it down: (15 × 10) + (15 × 2) = 150 + 30 = 180'
  },
  {
    id: '2',
    category: 'Number Properties',
    difficulty: 'easy',
    question: 'What is the sum of the first 10 positive integers?',
    correct_answer: '55',
    explanation: 'Use the formula n(n+1)/2 where n=10: 10(11)/2 = 55'
  },
  {
    id: '3',
    category: 'Algebra',
    difficulty: 'easy',
    question: 'Solve for x: 3x + 5 = 20',
    correct_answer: '5',
    explanation: 'Subtract 5 from both sides: 3x = 15, then divide by 3: x = 5'
  },
  {
    id: '4',
    category: 'Geometry',
    difficulty: 'easy',
    question: 'What is the area of a rectangle with length 8 and width 6?',
    correct_answer: '48',
    explanation: 'Area = length × width = 8 × 6 = 48'
  },
  {
    id: '5',
    category: 'Mental Math',
    difficulty: 'medium',
    question: 'What is 25% of 160?',
    correct_answer: '40',
    explanation: 'To find 25%, divide by 4: 160 ÷ 4 = 40'
  },
  {
    id: '6',
    category: 'Number Properties',
    difficulty: 'medium',
    question: 'How many factors does 72 have?',
    correct_answer: '12',
    explanation: 'Prime factorization: 72 = 2³ × 3². Number of factors = (3+1)(2+1) = 4 × 3 = 12'
  },
  {
    id: '7',
    category: 'Algebra',
    difficulty: 'medium',
    question: 'If x² + y² = 25 and xy = 12, what is x + y?',
    correct_answer: '7',
    explanation: 'Use (x+y)² = x² + 2xy + y² = 25 + 24 = 49, so x + y = 7'
  },
  {
    id: '8',
    category: 'Geometry',
    difficulty: 'medium',
    question: 'In a right triangle, if one leg is 5 and the hypotenuse is 13, what is the other leg?',
    correct_answer: '12',
    explanation: 'Use Pythagorean theorem: 5² + x² = 13², so x = 12'
  },
  {
    id: '9',
    category: 'Mental Math',
    difficulty: 'hard',
    question: 'What is 68 × 67?',
    correct_answer: '4556',
    explanation: 'Use (a+1)(a-1) pattern: 68 × 67 = (67+1)(67) = 67² + 67 = 4489 + 67 = 4556'
  },
  {
    id: '10',
    category: 'Number Properties',
    difficulty: 'hard',
    question: 'What is the remainder when 2⁵⁰ is divided by 7?',
    correct_answer: '4',
    explanation: 'Use cyclicity: 2¹ ≡ 2, 2² ≡ 4, 2³ ≡ 1 (mod 7). Since 50 ≡ 2 (mod 3), 2⁵⁰ ≡ 4 (mod 7)'
  }
];