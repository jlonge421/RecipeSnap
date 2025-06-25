export interface Recipe {
  id: string; // Unique ID for each recipe, can be title or generated
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string; // Placeholder image URL
  dataAiHint?: string; // For placeholder image search keywords
}
