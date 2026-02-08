
import { GoogleGenAI } from "@google/genai";
import { FASHION_PROMPT_TEMPLATE } from "../constants";
import { ModelSettings } from "../types";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateFashionPhoto(
    base64ImageFlat: string,
    base64ImageMannequin: string,
    location: string, 
    garmentStyle: string,
    poseDescription: string,
    bottomColor: string | null,
    modelSettings: ModelSettings,
    mood: string,
    isHighQuality: boolean
  ): Promise<string> {
    const modelName = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const prompt = FASHION_PROMPT_TEMPLATE(location, garmentStyle, poseDescription, bottomColor, modelSettings, mood);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        // Re-initialize to catch any potential API key updates
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64ImageFlat.split(',')[1], // Remove prefix
                  mimeType: 'image/jpeg',
                },
              },
              {
                inlineData: {
                  data: base64ImageMannequin.split(',')[1], // Remove prefix
                  mimeType: 'image/jpeg',
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: isHighQuality ? {
            imageConfig: {
              aspectRatio: "3:4",
              imageSize: "2K"
            }
          } : undefined
        });

        const candidate = response.candidates?.[0];
        if (!candidate) throw new Error("No response from AI");

        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }

        throw new Error("No image data found in AI response");

      } catch (error: any) {
        // Check for Quota/Rate Limit errors
        const isQuotaError = 
          error.status === 429 || 
          error.code === 429 ||
          (error.message && (
            error.message.includes("429") || 
            error.message.includes("quota") || 
            error.message.includes("RESOURCE_EXHAUSTED")
          ));

        if (isQuotaError && attempts < maxAttempts - 1) {
          const delay = Math.pow(2, attempts) * 3000 + Math.random() * 1000; // Backoff: ~3s, ~6s...
          console.warn(`Quota hit (Attempt ${attempts + 1}/${maxAttempts}). Retrying in ${Math.round(delay)}ms...`);
          await sleep(delay);
          attempts++;
          continue;
        }

        console.error("Gemini Generation Error:", error);
        
        if (error.message?.includes("Requested entity was not found")) {
          throw new Error("API_KEY_ERROR");
        }
        
        // If we ran out of retries or it's another error, throw it
        if (isQuotaError) {
             throw new Error("Le quota de l'IA est temporairement dépassé. Veuillez réessayer dans une minute.");
        }
        
        throw error;
      }
    }
    
    throw new Error("Failed to generate image after multiple attempts");
  }
}

export const geminiService = new GeminiService();
