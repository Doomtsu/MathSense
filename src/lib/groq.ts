import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = apiKey ? new Groq({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

interface GeneratedQuestion {
  question: string;
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  course: string;
}

export async function generateQuestions(
  count: number = 10,
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert',
  courses?: string[]
): Promise<GeneratedQuestion[]> {
  if (!groq) {
    throw new Error('Groq API key not configured');
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are a math teacher creating questions for a quiz. Generate valid JSON containing an array of math questions."
        },
        {
          role: "user",
          content: `Generate a JSON object with a 'questions' array containing ${count} math questions${
            difficulty ? ` with ${difficulty} difficulty` : ''
          }${
            courses && courses.length > 0 ? ` from the following courses: ${courses.join(', ')}` : ''
          }. Each question should have these properties:
            - question (string)
            - correct_answer (string)
            - explanation (string)
            - difficulty (string: "${difficulty || 'easy'}")
            - category (string: "Mental Math", "Number Properties", "Algebra", or "Geometry")
            - course (string: one of [${courses?.join(', ') || 'Algebra 1, Geometry, Algebra 2, Pre-Calculus, Calculus, Statistics'}])
            
            Example format:
            {
              "questions": [
                {
                  "question": "What is 15 × 12?",
                  "correct_answer": "180",
                  "explanation": "Break it down: (15 × 10) + (15 × 2) = 150 + 30 = 180",
                  "difficulty": "${difficulty || 'easy'}",
                  "category": "Mental Math",
                  "course": "Algebra 1"
                }
              ]
            }`
        }
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    try {
      const result = JSON.parse(content);
      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error('Invalid response format');
      }
      return result.questions;
    } catch (parseError) {
      console.error('Failed to parse response:', content);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}