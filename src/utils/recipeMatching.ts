import { Recipe } from '../lib/supabase';

export interface RecipeWithMatch extends Recipe {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export function calculateRecipeMatch(
  recipe: Recipe,
  availableIngredients: string[]
): RecipeWithMatch {
  if (availableIngredients.length === 0) {
    return {
      ...recipe,
      matchPercentage: 0,
      matchedIngredients: [],
      missingIngredients: recipe.ingredients.map((i) => i.name),
    };
  }

  const recipeIngredients = recipe.ingredients.map((i) =>
    i.name.toLowerCase().trim()
  );

  const normalizedAvailable = availableIngredients.map((i) =>
    i.toLowerCase().trim()
  );

  const matchedIngredients = recipeIngredients.filter((recipeIng) => {
    return normalizedAvailable.some((availIng) => {
      return (
        recipeIng.includes(availIng) ||
        availIng.includes(recipeIng) ||
        areIngredientsSimilar(recipeIng, availIng)
      );
    });
  });

  const missingIngredients = recipeIngredients.filter(
    (ing) => !matchedIngredients.includes(ing)
  );

  const matchPercentage = Math.round(
    (matchedIngredients.length / recipeIngredients.length) * 100
  );

  return {
    ...recipe,
    matchPercentage,
    matchedIngredients,
    missingIngredients,
  };
}

function areIngredientsSimilar(ing1: string, ing2: string): boolean {
  const commonSubstitutions: { [key: string]: string[] } = {
    tomato: ['tomatoes', 'tomato sauce'],
    cheese: ['cheddar', 'mozzarella', 'parmesan', 'feta'],
    pasta: ['spaghetti', 'linguine', 'noodles'],
    chicken: ['chicken breast', 'chicken thigh'],
    oil: ['olive oil', 'vegetable oil', 'sesame oil'],
    onion: ['red onion', 'white onion', 'onions'],
    pepper: ['bell pepper', 'black pepper'],
  };

  for (const [base, variations] of Object.entries(commonSubstitutions)) {
    if (
      (ing1.includes(base) || variations.some((v) => ing1.includes(v))) &&
      (ing2.includes(base) || variations.some((v) => ing2.includes(v)))
    ) {
      return true;
    }
  }

  return false;
}

export function getSubstitutionSuggestions(
  missingIngredient: string
): string[] {
  const substitutions: { [key: string]: string[] } = {
    'heavy cream': ['milk + butter', 'coconut cream', 'greek yogurt'],
    'sour cream': ['greek yogurt', 'plain yogurt'],
    butter: ['margarine', 'coconut oil', 'olive oil'],
    eggs: ['flax eggs', 'chia seeds', 'applesauce'],
    'white wine': ['chicken broth', 'apple juice', 'white grape juice'],
    'fish sauce': ['soy sauce', 'worcestershire sauce'],
    'parmesan cheese': ['pecorino', 'nutritional yeast', 'aged cheddar'],
  };

  const normalized = missingIngredient.toLowerCase().trim();

  for (const [ingredient, subs] of Object.entries(substitutions)) {
    if (normalized.includes(ingredient) || ingredient.includes(normalized)) {
      return subs;
    }
  }

  return [];
}

export function filterRecipesByDietary(
  recipes: RecipeWithMatch[],
  dietaryPreferences: string[]
): RecipeWithMatch[] {
  if (dietaryPreferences.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    return dietaryPreferences.every((pref) =>
      recipe.dietary_tags.includes(pref)
    );
  });
}

export function filterRecipesByDifficulty(
  recipes: RecipeWithMatch[],
  difficulty: string
): RecipeWithMatch[] {
  if (difficulty === 'all') {
    return recipes;
  }

  return recipes.filter((recipe) => recipe.difficulty === difficulty);
}

export function filterRecipesByCookingTime(
  recipes: RecipeWithMatch[],
  maxTime: number
): RecipeWithMatch[] {
  return recipes.filter((recipe) => recipe.cooking_time <= maxTime);
}

export function sortRecipesByMatch(
  recipes: RecipeWithMatch[]
): RecipeWithMatch[] {
  return [...recipes].sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.cooking_time - b.cooking_time;
  });
}
