/*
  # Smart Recipe Generator Database Schema

  ## Overview
  This migration creates the complete database structure for the Smart Recipe Generator application,
  including tables for recipes, user preferences, ratings, and saved recipes.

  ## Tables Created

  ### 1. recipes
  Stores all recipe information including ingredients, instructions, and nutritional data.
  - `id` (uuid, primary key) - Unique recipe identifier
  - `name` (text) - Recipe name
  - `description` (text) - Brief recipe description
  - `cuisine` (text) - Type of cuisine (Italian, Mexican, etc.)
  - `difficulty` (text) - Easy, Medium, or Hard
  - `cooking_time` (integer) - Time in minutes
  - `servings` (integer) - Number of servings
  - `ingredients` (jsonb) - Array of ingredient objects
  - `instructions` (jsonb) - Array of instruction steps
  - `dietary_tags` (text[]) - Array of dietary tags (vegetarian, vegan, gluten-free, etc.)
  - `calories` (integer) - Calories per serving
  - `protein` (integer) - Protein in grams
  - `carbs` (integer) - Carbohydrates in grams
  - `fat` (integer) - Fat in grams
  - `image_url` (text) - Recipe image URL
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. user_ratings
  Tracks user ratings for recipes.
  - `id` (uuid, primary key) - Unique rating identifier
  - `user_id` (uuid) - Reference to authenticated user
  - `recipe_id` (uuid) - Reference to rated recipe
  - `rating` (integer) - Rating value (1-5)
  - `created_at` (timestamptz) - Rating timestamp

  ### 3. saved_recipes
  Stores user's favorite/saved recipes.
  - `id` (uuid, primary key) - Unique save identifier
  - `user_id` (uuid) - Reference to authenticated user
  - `recipe_id` (uuid) - Reference to saved recipe
  - `created_at` (timestamptz) - Save timestamp

  ### 4. user_preferences
  Stores user dietary preferences and restrictions.
  - `id` (uuid, primary key) - Unique preference identifier
  - `user_id` (uuid) - Reference to authenticated user
  - `dietary_preferences` (text[]) - Array of dietary preferences
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for recipes (no auth required)
  - Authenticated users can manage their own ratings, saved recipes, and preferences
  - Users can only view/modify their own data

  ## Indexes
  - Indexed foreign keys for optimal query performance
  - GIN index on ingredients for ingredient-based searches
  - Index on dietary_tags for filtering
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cuisine text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cooking_time integer NOT NULL,
  servings integer NOT NULL DEFAULT 4,
  ingredients jsonb NOT NULL,
  instructions jsonb NOT NULL,
  dietary_tags text[] DEFAULT '{}',
  calories integer NOT NULL,
  protein integer NOT NULL,
  carbs integer NOT NULL,
  fat integer NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create user_ratings table
CREATE TABLE IF NOT EXISTS user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Create saved_recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  dietary_preferences text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING gin(ingredients);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags ON recipes USING gin(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_user_ratings_recipe_id ON user_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_recipe_id ON saved_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes (public read access)
CREATE POLICY "Anyone can view recipes"
  ON recipes FOR SELECT
  USING (true);

-- RLS Policies for user_ratings
CREATE POLICY "Users can view all ratings"
  ON user_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own ratings"
  ON user_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON user_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON user_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for saved_recipes
CREATE POLICY "Users can view own saved recipes"
  ON saved_recipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes"
  ON saved_recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave recipes"
  ON saved_recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

UPDATE recipes 
SET image_url = '/biryani.jpg' 
WHERE name = 'Caprese Salad';

UPDATE recipes 
SET image_url = '/sandwich.jpg' 
WHERE name = 'Grilled Cheese Sandwich';
