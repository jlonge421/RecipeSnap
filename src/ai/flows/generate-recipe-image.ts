'use server';
/**
 * @fileOverview Generates an image for a recipe.
 * 
 * - generateRecipeImage - A function that generates an image for a recipe.
 * - GenerateRecipeImageInput - The input type for the generateRecipeImage function.
 * - GenerateRecipeImageOutput - The return type for the generateRecipeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRecipeImageInputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  description: z.string().describe('A short description of the recipe.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

export async function generateRecipeImage(input: GenerateRecipeImageInput): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

const generateRecipeImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async ({ title, description }) => {
    const prompt = `A delicious, professionally photographed plate of "${title}". ${description}. The image should be vibrant, appetizing, and styled for a food magazine cover.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const imageUrl = media.url;
    if (!imageUrl) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl };
  }
);
