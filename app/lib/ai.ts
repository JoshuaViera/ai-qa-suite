import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateAIResponse(
  systemPrompt: string,
  userInput: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Combine system prompt with user input
  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${userInput}`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  
  return text;
}