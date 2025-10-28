import React from 'react';
import { ScriptProvider, useScript } from './context/ScriptContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SceneViews } from './components/SceneViews';
import { SceneDetail } from './components/SceneDetailEdit';
import { FileUpload } from './components/FileUpload';

const AppContent: React.FC = () => {
  const { script, selectedScene } = useScript();

  if (!script) {
    return (
      <>
        <Header />
        <FileUpload />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <SceneViews />
      </div>
      {selectedScene && <SceneDetail scene={selectedScene} />}
    </div>
  );
};

function App() {
  return (
    <ScriptProvider>
      <AppContent />
    </ScriptProvider>
  );
}

export default App;
