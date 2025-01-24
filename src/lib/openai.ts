import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

interface GeneratedQuestion {
  question: string;
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
}

export async function generateQuestions(count: number = 10): Promise<GeneratedQuestion[]> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a math teacher creating questions for a math quiz. Generate questions that are clear, concise, and appropriate for the specified difficulty level."
        },
        {
          role: "user",
          content: `Generate ${count} math questions. For each question, provide:
            1. The question text
            2. The correct answer (numerical only)
            3. A brief explanation
            4. Difficulty level (easy, medium, hard, or expert)
            5. Category (Mental Math, Number Properties, Algebra, or Geometry)
            
            Format the response as a JSON array of objects with these properties:
            { question, correct_answer, explanation, difficulty, category }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}