import React from 'react';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div className="max-w-md bg-[var(--color-background-secondary)]/80 backdrop-blur-md border border-[var(--color-border-primary)] rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-[var(--gradient-primary)]">
          Premium Features Unlocked
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-4">
          To generate high-quality images (2K, 4K) and videos, this app requires an API key associated with a paid Google Cloud project.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Your key is used only for the requests you make and is not stored. 
          See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-accent)]">billing documentation</a> for details.
        </p>
        <button
          onClick={onSelectKey}
          className="mt-6 w-full bg-[var(--gradient-primary)] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all hover:opacity-90"
        >
          Select Your API Key
        </button>
      </div>
    </div>
  );
};