
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, GroundingChunk } from '../types';

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const chatWithAgroMind = async (
  prompt: string,
  base64Image?: string,
  history: Message[] = []
): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  const ai = getAIClient();
  
  const systemInstruction = `
    You are AgroMind AI, a world-class agricultural consultant and agronomist.
    Your mission is to help farmers maximize yields, manage pests, understand market trends, and navigate weather challenges.
    
    Guidelines:
    1. Use Google Search grounding to provide real-time data on local weather, crop prices, and agricultural news.
    2. If an image is provided, analyze it for signs of crop disease, pests, or nutrient deficiencies.
    3. Provide actionable, practical advice.
    4. Be respectful and professional.
    5. Always mention relevant sources found in the search results.
  `;

  // Prepare contents for the API
  const parts: any[] = [{ text: prompt }];
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I'm sorry, I couldn't process that request.";
    
    // Extract sources from grounding metadata
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[];
    
    if (chunks) {
      chunks.forEach(chunk => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
