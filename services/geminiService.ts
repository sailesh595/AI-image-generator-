
import { GoogleGenAI, GenerateImagesResponse } from "@google/genai";

// Ensure the API key is available. In a real app, you'd have a more robust way to handle this.
if (!process.env.API_KEY) {
  // In a real application, you might want to throw an error or handle this case differently.
  // For this example, we log a warning. The app will fail at runtime if the key is missing.
  console.warn("API_KEY environment variable not set. The application will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateImagesResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated. The response may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during image generation.");
  }
};
