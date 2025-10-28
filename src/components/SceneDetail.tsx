import React from 'react';
import { X, MapPin, Clock, Users, MessageSquare } from 'lucide-react';
import type { Scene, FountainElement } from '../utils/fountainParser';
import { useScript } from '../context/ScriptContext';

interface SceneDetailProps {
  scene: Scene;
}

export const SceneDetail: React.FC<SceneDetailProps> = ({ scene }) => {
  const { setSelectedScene } = useScript();

  const renderElement = (element: FountainElement, index: number) => {
    switch (element.type) {
      case 'scene_heading':
        return (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              {element.text}
            </h2>
          </div>
        );

      case 'action':
        return (
          <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {element.text}
          </p>
        );

      case 'character':
        return (
          <div key={index} className="mt-6 mb-2">
            <p className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center">
              {element.text}
            </p>
          </div>
        );

      case 'dialogue':
        return (
          <p key={index} className="mb-2 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-center px-8">
            {element.text}
          </p>
        );

      case 'parenthetical':
        return (
          <p key={index} className="mb-2 text-gray-600 dark:text-gray-400 italic text-center">
            {element.text}
          </p>
        );

      case 'transition':
        return (
          <p key={index} className="my-4 text-gray-600 dark:text-gray-400 uppercase text-right font-semibold">
            {element.text}
          </p>
        );

      case 'note':
        return (
          <div key={index} className="my-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">Note:</span> {element.text}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => setSelectedScene(null)}
      />

      {/* Modal */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/4 lg:w-2/3 glass-strong shadow-2xl overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-strong border-b border-slate-200/50 dark:border-slate-700/50 shadow-md">
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Scene {scene.sceneNumber}
                </span>
                {scene.intExt && (
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-xs font-semibold">
                    {scene.intExt}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {scene.location || scene.heading}
              </h2>
            </div>
            <button
              onClick={() => setSelectedScene(null)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Scene Meta Info */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-4">
              {scene.timeOfDay && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{scene.timeOfDay}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{scene.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{scene.characters.length} Characters</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{scene.dialogueCount} Lines</span>
              </div>
            </div>

            {/* Characters */}
            {scene.characters.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Characters in this scene
                </p>
                <div className="flex flex-wrap gap-2">
                  {scene.characters.map((char, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {scene.elements.map((element, index) => renderElement(element, index))}
          </div>
        </div>
      </div>
    </div>
  );
};
