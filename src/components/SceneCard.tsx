import React from 'react';
import { MapPin, Clock, Users, MessageSquare, Sunrise, Sun, Sunset, Moon as MoonIcon } from 'lucide-react';
import type { Scene } from '../utils/fountainParser';
import { useScript } from '../context/ScriptContext';

interface SceneCardProps {
  scene: Scene;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const { setSelectedScene } = useScript();

  const getTimeIcon = (timeOfDay: string) => {
    const time = timeOfDay.toLowerCase();
    if (time.includes('morning') || time.includes('dawn')) return Sunrise;
    if (time.includes('day') || time.includes('afternoon')) return Sun;
    if (time.includes('evening') || time.includes('dusk')) return Sunset;
    if (time.includes('night')) return MoonIcon;
    return Clock;
  };

  const getIntExtColor = (intExt: string) => {
    switch (intExt) {
      case 'INT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'EXT':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'INT./EXT.':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getIntExtGradient = (intExt: string) => {
    switch (intExt) {
      case 'INT':
        return 'from-blue-500/20 to-blue-600/20';
      case 'EXT':
        return 'from-green-500/20 to-green-600/20';
      case 'INT./EXT.':
        return 'from-purple-500/20 to-purple-600/20';
      default:
        return 'from-gray-500/20 to-gray-600/20';
    }
  };

  const TimeIcon = getTimeIcon(scene.timeOfDay);

  const actionText = scene.elements
    .filter(e => e.type === 'action')
    .map(e => e.text)
    .join(' ')
    .slice(0, 150);

  return (
    <div
      onClick={() => setSelectedScene(scene)}
      className="group glass rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-purple-500 hover:scale-[1.02]"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-br ${getIntExtGradient(scene.intExt)} p-4 border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
            Scene {scene.sceneNumber}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getIntExtColor(scene.intExt)}`}>
            {scene.intExt || 'SCENE'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {scene.location || scene.heading}
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Time and location info */}
        <div className="flex flex-wrap gap-2 mb-3">
          {scene.timeOfDay && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <TimeIcon className="w-4 h-4" />
              <span>{scene.timeOfDay}</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{scene.location || 'Location'}</span>
          </div>
        </div>

        {/* Action preview */}
        {actionText && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
            {actionText}...
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400" title="Characters">
              <Users className="w-4 h-4" />
              <span>{scene.characters.length}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400" title="Dialogue Lines">
              <MessageSquare className="w-4 h-4" />
              <span>{scene.dialogueCount}</span>
            </div>
          </div>
          <button className="text-xs text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300">
            View Details →
          </button>
        </div>

        {/* Characters */}
        {scene.characters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-1">
              {scene.characters.slice(0, 3).map((char, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {char}
                </span>
              ))}
              {scene.characters.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                  +{scene.characters.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
