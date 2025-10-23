import { GoogleGenerativeAI } from '@google/generative-ai';

export async function testAIConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });  
  const result = await model.generateContent('Say hello in a friendly way');
  const response = await result.response;
  const text = response.text();
  
  return text;
}