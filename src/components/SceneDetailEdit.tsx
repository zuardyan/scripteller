import React, { useState } from 'react';
import { X, MapPin, Clock, Users, MessageSquare, Edit2, Save, Undo } from 'lucide-react';
import type { Scene, FountainElement } from '../utils/fountainParser';
import { useScript } from '../context/ScriptContext';

interface SceneDetailProps {
  scene: Scene;
}

export const SceneDetail: React.FC<SceneDetailProps> = ({ scene: initialScene }) => {
  const { setSelectedScene, script, setScript } = useScript();
  const [isEditing, setIsEditing] = useState(false);
  const [editedScene, setEditedScene] = useState(initialScene);

  const handleSave = () => {
    if (!script) return;

    // Update the scene in the script
    const updatedScenes = script.scenes.map(s =>
      s.id === editedScene.id ? editedScene : s
    );

    setScript({
      ...script,
      scenes: updatedScenes,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScene(initialScene);
    setIsEditing(false);
  };

  const handleElementChange = (index: number, newText: string) => {
    const updatedElements = [...editedScene.elements];
    updatedElements[index] = { ...updatedElements[index], text: newText };

    setEditedScene({
      ...editedScene,
      elements: updatedElements,
    });
  };

  const renderElement = (element: FountainElement, index: number) => {
    const commonInputClass = "w-full bg-transparent border-2 border-dashed border-blue-300 dark:border-purple-500/50 rounded-lg p-2 focus:outline-none focus:border-blue-500 dark:focus:border-purple-400 transition-colors";

    if (isEditing) {
      switch (element.type) {
        case 'scene_heading':
          return (
            <div key={index} className="mb-6">
              <input
                type="text"
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                className={`${commonInputClass} text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide`}
              />
            </div>
          );

        case 'action':
          return (
            <div key={index} className="mb-4">
              <textarea
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                rows={3}
                className={`${commonInputClass} text-gray-700 dark:text-gray-300 leading-relaxed resize-y`}
              />
            </div>
          );

        case 'character':
          return (
            <div key={index} className="mt-6 mb-2">
              <input
                type="text"
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                className={`${commonInputClass} font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center`}
              />
            </div>
          );

        case 'dialogue':
          return (
            <div key={index} className="mb-2">
              <textarea
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                rows={2}
                className={`${commonInputClass} text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-center px-8 resize-y`}
              />
            </div>
          );

        case 'parenthetical':
          return (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                className={`${commonInputClass} text-gray-600 dark:text-gray-400 italic text-center`}
              />
            </div>
          );

        case 'transition':
          return (
            <div key={index} className="my-4">
              <input
                type="text"
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                className={`${commonInputClass} text-gray-600 dark:text-gray-400 uppercase text-right font-semibold`}
              />
            </div>
          );

        case 'note':
          return (
            <div key={index} className="my-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
              <textarea
                value={element.text}
                onChange={(e) => handleElementChange(index, e.target.value)}
                rows={2}
                className="w-full bg-transparent text-sm text-yellow-800 dark:text-yellow-200 border-none focus:outline-none resize-y"
              />
            </div>
          );

        default:
          return null;
      }
    }

    // Read-only mode (original rendering)
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
        onClick={() => !isEditing && setSelectedScene(null)}
      />

      {/* Modal */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/4 lg:w-2/3 glass-strong shadow-2xl overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-strong border-b border-slate-200/50 dark:border-slate-700/50 shadow-md">
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Scene {editedScene.sceneNumber}
                </span>
                {editedScene.intExt && (
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-xs font-semibold">
                    {editedScene.intExt}
                  </span>
                )}
                {isEditing && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold animate-pulse">
                    Editing
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editedScene.location || editedScene.heading}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                    title="Cancel"
                  >
                    <Undo className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg flex items-center space-x-2"
                    title="Save Changes"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg flex items-center space-x-2"
                  title="Edit Scene"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (isEditing) {
                    if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                      setSelectedScene(null);
                    }
                  } else {
                    setSelectedScene(null);
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Scene Meta Info */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-4">
              {editedScene.timeOfDay && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{editedScene.timeOfDay}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{editedScene.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{editedScene.characters.length} Characters</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{editedScene.dialogueCount} Lines</span>
              </div>
            </div>

            {/* Characters */}
            {editedScene.characters.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Characters in this scene
                </p>
                <div className="flex flex-wrap gap-2">
                  {editedScene.characters.map((char, idx) => (
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
          {isEditing && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Edit Mode:</strong> Click on any text to edit. Changes will be saved when you click "Save".
              </p>
            </div>
          )}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {editedScene.elements.map((element, index) => renderElement(element, index))}
          </div>
        </div>
      </div>
    </div>
  );
};
