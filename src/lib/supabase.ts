import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cooking_time: number;
  servings: number;
  ingredients: { name: string; amount: string }[];
  instructions: { step: number; instruction: string }[];
  dietary_tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url?: string;
  created_at?: string;
}

export interface UserRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  created_at: string;
}

export interface SavedRecipe {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}
