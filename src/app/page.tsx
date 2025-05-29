"use client";

import { useState } from 'react';
import type { Recipe } from '@/types';
import { ImageUploader } from '@/components/recipe-snap/ImageUploader';
import { IngredientList } from '@/components/recipe-snap/IngredientList';
import { RecipeList } from '@/components/recipe-snap/RecipeList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { identifyIngredients, type IdentifyIngredientsOutput } from '@/ai/flows/identify-ingredients';
import { generateRecipes, type GenerateRecipesOutput } from '@/ai/flows/generate-recipes';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Loader2, Salad, Sparkles } from 'lucide-react'; // Sparkles for AI generation
import { Separator } from '@/components/ui/separator';

export default function RecipeSnapPage() {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  const [isIdentifyingIngredients, setIsIdentifyingIngredients] = useState(false);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);

  const [savedRecipeIds, setSavedRecipeIds] = useLocalStorage<string[]>('savedRecipeIds', []);

  const { toast } = useToast();

  const handleImageUpload = (file: File, dataUri: string) => {
    setUploadedImageFile(file);
    setImagePreview(dataUri); // For potential display or direct use
    setIngredients([]); // Reset previous results
    setRecipes([]);
    setHasAttemptedGeneration(false);
  };

  const handleIdentifyIngredients = async () => {
    if (!imagePreview) {
      toast({ title: 'No Image', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setIsIdentifyingIngredients(true);
    setIngredients([]);
    setRecipes([]);
    setHasAttemptedGeneration(false);

    try {
      const result: IdentifyIngredientsOutput = await identifyIngredients({ photoDataUri: imagePreview });
      if (result && result.ingredients && result.ingredients.length > 0) {
        setIngredients(result.ingredients);
        toast({ title: 'Ingredients Identified!', description: `${result.ingredients.length} ingredients found. Ready to generate recipes.` });
        // Automatically trigger recipe generation if ingredients are found
        await handleGenerateRecipes(result.ingredients);
      } else {
        setIngredients([]);
        toast({ title: 'No Ingredients Found', description: 'Could not identify ingredients from the image. Try a clearer photo.', variant: 'default' });
      }
    } catch (error) {
      console.error('Error identifying ingredients:', error);
      toast({ title: 'Error', description: 'Failed to identify ingredients. Please try again.', variant: 'destructive' });
      setIngredients([]);
    } finally {
      setIsIdentifyingIngredients(false);
    }
  };

  const handleGenerateRecipes = async (currentIngredients?: string[]) => {
    const ingredientsToUse = currentIngredients || ingredients;
    if (ingredientsToUse.length === 0) {
      toast({ title: 'No Ingredients', description: 'No ingredients to generate recipes from.', variant: 'destructive' });
      return;
    }
    setIsGeneratingRecipes(true);
    setRecipes([]);
    setHasAttemptedGeneration(true);

    try {
      const result: GenerateRecipesOutput = await generateRecipes({ ingredients: ingredientsToUse });
      if (result && result.recipes && result.recipes.length > 0) {
        const recipesWithPlaceholders: Recipe[] = result.recipes.map((recipe, index) => ({
          ...recipe,
          id: recipe.title + "_" + index, // Simple unique ID
          imageUrl: `https://placehold.co/400x300.png?text=${encodeURIComponent(recipe.title)}`,
          dataAiHint: "food cooking", 
        }));
        setRecipes(recipesWithPlaceholders);
        toast({ title: 'Recipes Generated!', description: `${recipesWithPlaceholders.length} recipes ready for you.` });
      } else {
        setRecipes([]);
        toast({ title: 'No Recipes Generated', description: 'Could not generate recipes from the identified ingredients.', variant: 'default' });
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      toast({ title: 'Error', description: 'Failed to generate recipes. Please try again.', variant: 'destructive' });
      setRecipes([]);
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  const handleSaveToggle = (recipeId: string) => {
    setSavedRecipeIds(prev =>
      prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
    );
    toast({
      title: savedRecipeIds.includes(recipeId) ? 'Recipe Unsaved' : 'Recipe Saved!',
      description: savedRecipeIds.includes(recipeId) ? 'Removed from your favorites.' : 'Added to your favorites.',
    });
  };
  
  const isProcessing = isIdentifyingIngredients || isGeneratingRecipes;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center">
          <Salad className="w-10 h-10 md:w-12 md:h-12 mr-3" />
          RecipeSnap
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Turn your ingredients into delicious meals with a snap!
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <ImageUploader onImageUpload={handleImageUpload} isProcessing={isProcessing} />

        {imagePreview && (
          <div className="flex justify-center">
            <Button
              onClick={handleIdentifyIngredients}
              disabled={isProcessing || !imagePreview}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isIdentifyingIngredients ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              {isIdentifyingIngredients ? 'Finding Ingredients...' : (ingredients.length > 0 ? 'Re-scan Ingredients' : 'Find Ingredients & Recipes')}
            </Button>
          </div>
        )}
        
        {(isIdentifyingIngredients || ingredients.length > 0) && <Separator className="my-6 md:my-8" />}

        { (isIdentifyingIngredients || ingredients.length > 0) &&
          <IngredientList ingredients={ingredients} isLoading={isIdentifyingIngredients} />
        }

        {(isGeneratingRecipes || recipes.length > 0 || (hasAttemptedGeneration && !isGeneratingRecipes)) && <Separator className="my-6 md:my-8" />}
        
        {(isGeneratingRecipes || recipes.length > 0 || (hasAttemptedGeneration && !isGeneratingRecipes)) && (
          <RecipeList
            recipes={recipes}
            savedRecipeIds={savedRecipeIds}
            onSaveToggle={handleSaveToggle}
            isLoading={isGeneratingRecipes}
            hasAttemptedGeneration={hasAttemptedGeneration}
          />
        )}
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RecipeSnap. Cook with AI!</p>
      </footer>
    </div>
  );
}
