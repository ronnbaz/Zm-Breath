import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getZenWisdom = async (feeling: string): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Breathe deeply and find your own wisdom.";
  }

  try {
    const prompt = `
      L'utilisateur ressent : "${feeling}".
      Agis comme un maître Zen sage et bienveillant.
      Donne un conseil très court (maximum 2 phrases) ou une citation apaisante en Français.
      Le ton doit être poétique, calmant et profond.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.7,
      }
    });

    return response.text || "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.";
  } catch (error) {
    console.error("Zen Service Error:", error);
    return "Respirez profondément. Tout passe, tout change.";
  }
};