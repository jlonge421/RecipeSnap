"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Utensils } from 'lucide-react';

interface IngredientListProps {
  ingredients: string[];
  isLoading: boolean;
}

export function IngredientList({ ingredients, isLoading }: IngredientListProps) {
  if (isLoading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Utensils className="w-6 h-6 mr-2 text-primary" />
            Identified Ingredients
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (ingredients.length === 0) {
    return null; // Or a message like "No ingredients identified yet."
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Utensils className="w-6 h-6 mr-2 text-primary" />
          Identified Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                {ingredient}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No ingredients identified from the image yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
