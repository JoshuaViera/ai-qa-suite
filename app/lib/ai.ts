export async function generateAIResponse(
  systemPrompt: string,
  userInput: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Use v1beta API with gemini-2.0-flash (confirmed available in your model list)
  const fullPrompt = `${systemPrompt}\n\nUser Input:\n${userInput}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${error}`);
  }

  const data = await response.json();
  
  // Extract the text from the response
  const text = data.candidates[0].content.parts[0].text;
  
  return text;
}