import { Clock, ChefHat, Star, Bookmark } from 'lucide-react';
import { Recipe } from '../lib/supabase';

interface RecipeCardProps {
  recipe: Recipe;
  matchPercentage?: number;
  onViewDetails: (recipe: Recipe) => void;
}

export default function RecipeCard({
  recipe,
  matchPercentage,
  onViewDetails,
}: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 cursor-pointer group">
      <div
        onClick={() => onViewDetails(recipe)}
        className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative overflow-hidden"
      >
        <ChefHat size={64} className="text-emerald-600 opacity-20" />
        {matchPercentage !== undefined && matchPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {matchPercentage}% match
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3
            onClick={() => onViewDetails(recipe)}
            className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2"
          >
            {recipe.name}
          </h3>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
            {recipe.cuisine}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.cooking_time} min</span>
          </div>
          <div className="font-medium">{recipe.calories} cal</div>
        </div>

        {recipe.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.dietary_tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => onViewDetails(recipe)}
          className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}
