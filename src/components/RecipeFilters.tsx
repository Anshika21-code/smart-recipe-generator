import { Filter } from 'lucide-react';

interface RecipeFiltersProps {
  difficultyFilter: string;
  setDifficultyFilter: (value: string) => void;
  maxCookingTime: number;
  setMaxCookingTime: (value: number) => void;
}

export default function RecipeFilters({
  difficultyFilter,
  setDifficultyFilter,
  maxCookingTime,
  setMaxCookingTime,
}: RecipeFiltersProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-slate-600" />
        <h2 className="text-xl font-semibold text-slate-800">Filters</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          >
            <option value="all">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Max Cooking Time: {maxCookingTime} minutes
          </label>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={maxCookingTime}
            onChange={(e) => setMaxCookingTime(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>10 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
