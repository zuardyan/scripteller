import React, { useMemo } from 'react';
import { SceneCard } from './SceneCard';
import { useScript } from '../context/ScriptContext';
import type { Scene } from '../utils/fountainParser';
import { Film } from 'lucide-react';

export const SceneViews: React.FC = () => {
  const { script, viewMode, filterIntExt, filterCharacter, searchQuery } = useScript();

  const filteredScenes = useMemo(() => {
    if (!script) return [];

    let scenes = script.scenes;

    // Filter by INT/EXT
    if (filterIntExt !== 'all') {
      scenes = scenes.filter(scene => scene.intExt === filterIntExt);
    }

    // Filter by character
    if (filterCharacter) {
      scenes = scenes.filter(scene => scene.characters.includes(filterCharacter));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      scenes = scenes.filter(scene => {
        const locationMatch = scene.location.toLowerCase().includes(query);
        const headingMatch = scene.heading.toLowerCase().includes(query);
        const actionMatch = scene.elements.some(
          el => el.type === 'action' && el.text.toLowerCase().includes(query)
        );
        return locationMatch || headingMatch || actionMatch;
      });
    }

    return scenes;
  }, [script, filterIntExt, filterCharacter, searchQuery]);

  if (!script) return null;

  if (filteredScenes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No scenes found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenes.map(scene => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredScenes.map(scene => (
            <div key={scene.id} className="w-full">
              <SceneCard scene={scene} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'timeline') {
    return <TimelineView scenes={filteredScenes} />;
  }

  return null;
};

// Timeline View Component
const TimelineView: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />

          {/* Scenes */}
          <div className="space-y-8">
            {scenes.map((scene, index) => (
              <div key={scene.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white/80 dark:border-slate-900/80 shadow-xl shadow-blue-500/50 dark:shadow-purple-500/50" />

                {/* Scene number badge */}
                <div className="absolute left-0 top-6 w-12 text-center">
                  <span className="inline-block px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-bold shadow-md">
                    {scene.sceneNumber}
                  </span>
                </div>

                {/* Scene card */}
                <SceneCard scene={scene} />

                {/* Connection indicator */}
                {index < scenes.length - 1 && (
                  <div className="absolute left-8 -bottom-4 transform -translate-x-1/2">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
