import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { FountainScript, Scene } from '../utils/fountainParser';

interface ScriptContextType {
  script: FountainScript | null;
  setScript: (script: FountainScript | null) => void;
  selectedScene: Scene | null;
  setSelectedScene: (scene: Scene | null) => void;
  viewMode: 'grid' | 'timeline' | 'list';
  setViewMode: (mode: 'grid' | 'timeline' | 'list') => void;
  filterIntExt: 'all' | 'INT' | 'EXT' | 'INT./EXT.';
  setFilterIntExt: (filter: 'all' | 'INT' | 'EXT' | 'INT./EXT.') => void;
  filterCharacter: string | null;
  setFilterCharacter: (character: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const useScript = () => {
  const context = useContext(ScriptContext);
  if (!context) {
    throw new Error('useScript must be used within ScriptProvider');
  }
  return context;
};

interface ScriptProviderProps {
  children: ReactNode;
}

export const ScriptProvider: React.FC<ScriptProviderProps> = ({ children }) => {
  const [script, setScript] = useState<FountainScript | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'list'>('grid');
  const [filterIntExt, setFilterIntExt] = useState<'all' | 'INT' | 'EXT' | 'INT./EXT.'>('all');
  const [filterCharacter, setFilterCharacter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    console.log('Dark mode changed to:', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      console.log('Applied dark mode class');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      console.log('Removed dark mode class');
    }
  }, [darkMode]);

  const value: ScriptContextType = {
    script,
    setScript,
    selectedScene,
    setSelectedScene,
    viewMode,
    setViewMode,
    filterIntExt,
    setFilterIntExt,
    filterCharacter,
    setFilterCharacter,
    searchQuery,
    setSearchQuery,
    darkMode,
    setDarkMode,
  };

  return <ScriptContext.Provider value={value}>{children}</ScriptContext.Provider>;
};
