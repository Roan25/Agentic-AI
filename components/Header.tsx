import React from 'react';

interface HeaderProps {
  onReset: () => void;
  hasContent: boolean;
  currentView: 'creator' | 'tester';
  onSetView: (view: 'creator' | 'tester') => void;
}

const ViewToggleButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive ? 'bg-fuchsia-500 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'
    }`}
  >
    {children}
  </button>
);


export const Header: React.FC<HeaderProps> = ({ onReset, hasContent, currentView, onSetView }) => {
  return (
    <header className="w-full max-w-7xl mx-auto flex justify-between items-center">
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Content Creator AI
        </h1>
        <p className="text-sm text-gray-400">
          Powered by Gemini
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-1 flex items-center gap-1">
          <ViewToggleButton onClick={() => onSetView('creator')} isActive={currentView === 'creator'}>
            Creator
          </ViewToggleButton>
          <ViewToggleButton onClick={() => onSetView('tester')} isActive={currentView === 'tester'}>
            Agent Evaluation
          </ViewToggleButton>
        </div>
        {(hasContent || currentView === 'tester') && (
          <button
            onClick={onReset}
            className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            + New Project
          </button>
        )}
      </div>
    </header>
  );
};
