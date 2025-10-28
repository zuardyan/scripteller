import React, { useCallback, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseFountain } from '../utils/fountainParser';
import { useScript } from '../context/ScriptContext';

export const FileUpload: React.FC = () => {
  const { setScript } = useScript();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedScript = parseFountain(content);
        setScript(parsedScript);
      } catch (error) {
        console.error('Error parsing fountain file:', error);
        alert('Error parsing the fountain file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }, [setScript]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.fountain')) {
      alert('Please upload a .fountain file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedScript = parseFountain(content);
        setScript(parsedScript);
      } catch (error) {
        console.error('Error parsing fountain file:', error);
        alert('Error parsing the fountain file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }, [setScript]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-5xl font-black mb-3 gradient-text">
            MovieTeller
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Visual Story Exploration for Fountain Scripts
          </p>
        </div>

        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="glass border-2 border-dashed border-blue-300 dark:border-purple-500/50 rounded-3xl p-12 text-center hover:border-blue-500 dark:hover:border-purple-400 transition-all duration-300 cursor-pointer shadow-2xl shadow-blue-200/20 dark:shadow-purple-900/30 hover:shadow-blue-300/40 dark:hover:shadow-purple-700/40 hover:scale-[1.01]"
        >
          <Upload className="w-14 h-14 mx-auto mb-4 text-blue-500 dark:text-purple-400" />
          <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Upload Your Fountain Script</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Drag and drop your .fountain file here, or click anywhere to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".fountain"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl cursor-pointer inline-block transition-all duration-300 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
            Choose File
          </span>
        </div>

        <div className="mt-8 p-6 glass rounded-2xl border border-blue-200/50 dark:border-purple-500/30">
          <h4 className="font-bold mb-2 text-blue-900 dark:text-blue-100">What is Fountain?</h4>
          <p className="text-sm text-blue-800/90 dark:text-blue-200/90">
            Fountain is a plain text markup language for writing screenplays.
            It allows you to write scripts in any text editor and convert them to industry-standard formats.
          </p>
        </div>
      </div>
    </div>
  );
};
