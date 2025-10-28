import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, File, FileType, Table, ChevronDown } from 'lucide-react';
import { useScript } from '../context/ScriptContext';
import {
  exportToFountain,
  exportToFDX,
  exportToPDF,
  exportToHTML,
  exportToTXT,
  exportToCSV,
} from '../utils/exportUtils';

export const ExportMenu: React.FC = () => {
  const { script } = useScript();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!script) return null;

  const exportOptions = [
    {
      label: 'Fountain (.fountain)',
      icon: FileText,
      action: () => exportToFountain(script),
      description: 'Original format',
    },
    {
      label: 'Final Draft (.fdx)',
      icon: File,
      action: () => exportToFDX(script),
      description: 'Industry standard',
    },
    {
      label: 'PDF (.pdf)',
      icon: FileType,
      action: () => exportToPDF(script),
      description: 'Printable format',
    },
    {
      label: 'HTML (.html)',
      icon: FileText,
      action: () => exportToHTML(script),
      description: 'Web format',
    },
    {
      label: 'Plain Text (.txt)',
      icon: FileText,
      action: () => exportToTXT(script),
      description: 'Simple text',
    },
    {
      label: 'CSV Breakdown (.csv)',
      icon: Table,
      action: () => exportToCSV(script),
      description: 'Scene data',
    },
  ];

  const handleExport = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        title="Export Script"
      >
        <Download className="w-5 h-5" />
        <span className="hidden md:inline">Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-strong rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
              Export Formats
            </div>
            {exportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleExport(option.action)}
                  className="w-full flex items-start space-x-3 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-left group"
                >
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
