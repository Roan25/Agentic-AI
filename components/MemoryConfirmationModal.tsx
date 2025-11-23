import React from 'react';
import { Icon } from './Icon';

interface MemoryConfirmationModalProps {
  pattern: { style: string };
  onConfirm: () => void;
  onDecline: () => void;
}

export const MemoryConfirmationModal: React.FC<MemoryConfirmationModalProps> = ({ pattern, onConfirm, onDecline }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gradient-primary)]">
          <Icon path="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M19.5 8.25h-1.5m-15 3.75h1.5m15 0h1.5m-15 3.75h1.5m15 0h1.5M12 12l-3.5-3.5M12 12l3.5-3.5M12 12l-3.5 3.5M12 12l3.5 3.5" className="h-6 w-6 text-white" />
        </div>
        <h2 id="memory-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] mt-4">
          Agent is Learning
        </h2>
        <p className="text-[var(--color-text-secondary)] mt-2">
          I've noticed a preference for the <strong className="text-[var(--color-text-accent)] font-semibold">"{pattern.style}"</strong> style.
        </p>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Shall I save this to your permanent profile to streamline future requests?
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onDecline}
            className="px-6 py-2 rounded-lg bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)] text-[var(--color-text-primary)] font-semibold transition-colors"
          >
            Not now
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-[var(--gradient-primary)] hover:opacity-90 text-white font-bold transition-all"
          >
            Yes, Save Preference
          </button>
        </div>
      </div>
    </div>
  );
};