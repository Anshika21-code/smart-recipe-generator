import { X, Clock, Users, TrendingUp } from 'lucide-react';
import { Recipe } from '../lib/supabase';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-start rounded-t-2xl">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-emerald-50 text-base">{recipe.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Clock size={18} />
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {recipe.cooking_time} min
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Users size={18} />
                <span className="text-sm font-medium">Servings</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {recipe.servings}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">Difficulty</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {recipe.difficulty}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              Nutritional Information
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <div className="text-xs text-emerald-700 font-medium mb-1">
                  Calories
                </div>
                <div className="text-lg font-bold text-emerald-800">
                  {recipe.calories}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700 font-medium mb-1">
                  Protein
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {recipe.protein}g
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="text-xs text-amber-700 font-medium mb-1">
                  Carbs
                </div>
                <div className="text-lg font-bold text-amber-800">
                  {recipe.carbs}g
                </div>
              </div>
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                <div className="text-xs text-rose-700 font-medium mb-1">
                  Fat
                </div>
                <div className="text-lg font-bold text-rose-800">
                  {recipe.fat}g
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">
                      {ingredient.name}
                    </span>
                    <span className="text-slate-600"> - {ingredient.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction) => (
                <li key={instruction.step} className="flex gap-4">
                  <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {instruction.step}
                  </span>
                  <p className="flex-1 text-slate-700 leading-relaxed pt-1">
                    {instruction.instruction}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {recipe.dietary_tags.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Dietary Information
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
