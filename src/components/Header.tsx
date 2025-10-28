import React from 'react';
import { FileText, Moon, Sun, Grid3x3, List, Activity, Save } from 'lucide-react';
import { useScript } from '../context/ScriptContext';
import { ExportMenu } from './ExportMenu';
import { exportToFountain } from '../utils/exportUtils';

export const Header: React.FC = () => {
  const { script, darkMode, setDarkMode, viewMode, setViewMode, setScript } = useScript();

  const handleDarkModeToggle = () => {
    console.log('Toggle clicked. Current darkMode:', darkMode);
    setDarkMode(!darkMode);
  };

  const handleSave = () => {
    if (!script) return;
    exportToFountain(script);
  };

  const handleNewScript = () => {
    if (confirm('Are you sure you want to load a new script? Current progress will be lost.')) {
      setScript(null);
    }
  };

  return (
    <header className="glass-strong shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {script?.title || 'MovieTeller'}
              </h1>
              {script?.author && (
                <p className="text-sm text-gray-600 dark:text-gray-400">by {script.author}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {script && (
              <>
                <div className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    title="Grid View"
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'timeline'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    title="Timeline View"
                  >
                    <Activity className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg flex items-center space-x-2"
                  title="Save Script"
                >
                  <Save className="w-5 h-5" />
                  <span className="hidden md:inline">Save</span>
                </button>

                <ExportMenu />

                <button
                  onClick={handleNewScript}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  New Script
                </button>
              </>
            )}

            <button
              onClick={handleDarkModeToggle}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
