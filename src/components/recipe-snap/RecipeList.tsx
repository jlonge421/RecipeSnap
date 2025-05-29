"use client";

import type { Recipe } from '@/types';
import { RecipeCard } from './RecipeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChefHat, SearchX } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  savedRecipeIds: string[];
  onSaveToggle: (recipeId: string) => void;
  isLoading: boolean;
  hasAttemptedGeneration: boolean;
}

export function RecipeList({ recipes, savedRecipeIds, onSaveToggle, isLoading, hasAttemptedGeneration }: RecipeListProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <ChefHat className="w-8 h-8 mr-3 text-primary" />
          <h2 className="text-2xl font-semibold">Suggested Recipes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <Skeleton className="w-full h-48 sm:h-56" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardContent>
                <Skeleton className="h-10 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (recipes.length === 0 && hasAttemptedGeneration && !isLoading) {
    return (
       <Card className="w-full shadow-md text-center py-10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <SearchX className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">No Recipes Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We couldn&apos;t generate any recipes from the identified ingredients. Try a different image or check if the ingredients are clear.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (recipes.length === 0 && !isLoading) {
     return null; // Don't show anything if no recipes and no generation attempt yet
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <ChefHat className="w-8 h-8 mr-3 text-primary" />
        <h2 className="text-2xl font-semibold">Suggested Recipes</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSaved={savedRecipeIds.includes(recipe.id)}
            onSaveToggle={onSaveToggle}
          />
        ))}
      </div>
    </div>
  );
}
