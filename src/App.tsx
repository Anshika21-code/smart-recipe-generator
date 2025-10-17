import { useState, useEffect } from 'react';
import { ChefHat, Search, Sparkles } from 'lucide-react';
import { supabase, Recipe } from './lib/supabase';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import RecipeFilters from './components/RecipeFilters';
import {
  calculateRecipeMatch,
  filterRecipesByDietary,
  filterRecipesByDifficulty,
  filterRecipesByCookingTime,
  sortRecipesByMatch,
  RecipeWithMatch,
} from './utils/recipeMatching';

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithMatch[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [maxCookingTime, setMaxCookingTime] = useState<number>(120);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      applyFilters();
    }
  }, [
    recipes,
    ingredients,
    dietaryPreferences,
    difficultyFilter,
    maxCookingTime,
  ]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setRecipes(data || []);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = recipes.map((recipe) =>
      calculateRecipeMatch(recipe, ingredients)
    );

    filtered = filterRecipesByDietary(filtered, dietaryPreferences);
    filtered = filterRecipesByDifficulty(filtered, difficultyFilter);
    filtered = filterRecipesByCookingTime(filtered, maxCookingTime);
    filtered = sortRecipesByMatch(filtered);

    setFilteredRecipes(filtered);
  };

  const handleFindRecipes = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <ChefHat size={40} />
            <h1 className="text-4xl font-bold">Smart Recipe Generator</h1>
          </div>
          <p className="text-center text-emerald-50 mt-2 text-lg">
            Find delicious recipes based on ingredients you have
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading recipes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 text-lg font-medium">{error}</p>
            <button
              onClick={fetchRecipes}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <IngredientInput
              ingredients={ingredients}
              setIngredients={setIngredients}
              dietaryPreferences={dietaryPreferences}
              setDietaryPreferences={setDietaryPreferences}
            />

            {ingredients.length > 0 && !showResults && (
              <div className="flex justify-center">
                <button
                  onClick={handleFindRecipes}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg font-semibold"
                >
                  <Search size={24} />
                  Find Recipes
                  <Sparkles size={24} />
                </button>
              </div>
            )}

            {showResults && (
              <>
                <RecipeFilters
                  difficultyFilter={difficultyFilter}
                  setDifficultyFilter={setDifficultyFilter}
                  maxCookingTime={maxCookingTime}
                  setMaxCookingTime={setMaxCookingTime}
                />

                <div className="w-full max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {filteredRecipes.length > 0
                        ? `Found ${filteredRecipes.length} Recipe${
                            filteredRecipes.length !== 1 ? 's' : ''
                          }`
                        : 'No recipes found'}
                    </h2>
                    {ingredients.length > 0 && (
                      <button
                        onClick={() => {
                          setShowResults(false);
                          setIngredients([]);
                          setDietaryPreferences([]);
                        }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                      >
                        New Search
                      </button>
                    )}
                  </div>

                  {filteredRecipes.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
                      <p className="text-slate-600 text-lg mb-2">
                        No recipes match your criteria.
                      </p>
                      <p className="text-slate-500">
                        Try adjusting your filters or ingredients.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          matchPercentage={
                            ingredients.length > 0
                              ? recipe.matchPercentage
                              : undefined
                          }
                          onViewDetails={setSelectedRecipe}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {!showResults && filteredRecipes.length > 0 && (
              <div className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Popular Recipes
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredRecipes.slice(0, 6).map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onViewDetails={setSelectedRecipe}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300">
            Smart Recipe Generator - Find the perfect recipe for your
            ingredients
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
