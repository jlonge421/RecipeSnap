"use client";

import Image from 'next/image';
import type { Recipe } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, List, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onSaveToggle: (recipeId: string) => void;
}

export function RecipeCard({ recipe, isSaved, onSaveToggle }: RecipeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={recipe.dataAiHint}
        />
      </div>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold line-clamp-2">{recipe.title}</CardTitle>
        {recipe.description && (
          <CardDescription className="pt-1 line-clamp-3">
            {recipe.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center">
                <List className="w-4 h-4 mr-2" /> Ingredients
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger className="text-sm font-medium">
               <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" /> Instructions
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{recipe.instructions}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/20 transition-colors"
          onClick={() => onSaveToggle(recipe.id)}
          aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
        >
          <Heart className={cn("w-6 h-6", isSaved ? "fill-destructive text-destructive" : "text-muted-foreground")} />
        </Button>
      </CardFooter>
    </Card>
  );
}
