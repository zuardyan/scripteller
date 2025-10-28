import React from 'react';
import { Search, Filter, X, BarChart3, Users as UsersIcon } from 'lucide-react';
import { useScript } from '../context/ScriptContext';

export const Sidebar: React.FC = () => {
  const {
    script,
    filterIntExt,
    setFilterIntExt,
    filterCharacter,
    setFilterCharacter,
    searchQuery,
    setSearchQuery,
  } = useScript();

  if (!script) return null;

  const characters = Array.from(script.characters.values()).sort(
    (a, b) => b.dialogueLines - a.dialogueLines
  );

  const intScenes = script.scenes.filter(s => s.intExt === 'INT').length;
  const extScenes = script.scenes.filter(s => s.intExt === 'EXT').length;
  const intExtScenes = script.scenes.filter(s => s.intExt === 'INT./EXT.').length;

  return (
    <aside className="w-80 glass-strong border-r border-slate-200/50 dark:border-slate-700/50 overflow-y-auto flex-shrink-0 scrollbar-thin">
      <div className="p-6 space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Search className="w-4 h-4 inline mr-2" />
            Search Scenes
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, action..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Script Statistics */}
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Script Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Scenes</span>
              <span className="font-semibold text-gray-900 dark:text-white">{script.totalScenes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Characters</span>
              <span className="font-semibold text-gray-900 dark:text-white">{script.characters.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">INT Scenes</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{intScenes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">EXT Scenes</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{extScenes}</span>
            </div>
            {intExtScenes > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">INT./EXT. Scenes</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{intExtScenes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter by INT/EXT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Filter className="w-4 h-4 inline mr-2" />
            Scene Type
          </label>
          <div className="space-y-2">
            {['all', 'INT', 'EXT', 'INT./EXT.'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterIntExt(type as any)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  filterIntExt === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type === 'all' ? 'All Scenes' : `${type} Only`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Character */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <UsersIcon className="w-4 h-4 inline mr-2" />
            Filter by Character
          </label>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            <button
              onClick={() => setFilterCharacter(null)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                filterCharacter === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Characters
            </button>
            {characters.map((character) => (
              <button
                key={character.name}
                onClick={() => setFilterCharacter(character.name)}
                className={`w-full px-4 py-2 rounded-lg text-sm transition-colors text-left flex items-center justify-between ${
                  filterCharacter === character.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="truncate">{character.name}</span>
                <span className="ml-2 text-xs opacity-75">
                  {character.scenes.length} scenes
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
