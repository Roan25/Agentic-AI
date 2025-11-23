import React from 'react';
import { CreativeConcept } from '../types';
import { Icon } from './Icon';

interface UserProfileModalProps {
  sessionHistory: CreativeConcept[];
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ sessionHistory, onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
       onClick={onClose}
    >
      <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl shadow-2xl max-w-2xl w-full text-center flex flex-col max-h-[80vh]"  onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[var(--color-border-primary)] flex items-center justify-between">
             <h2 id="profile-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gradient-primary)]">
                    <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="h-6 w-6 text-white" />
                </div>
                My Profile
            </h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)]"
                aria-label="Close profile modal"
            >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
            <h3 className="text-lg font-semibold text-left text-[var(--color-text-accent)] mb-4">Current Session History</h3>
            {sessionHistory.length > 0 ? (
                <div className="space-y-4 text-left">
                    {sessionHistory.map((concept, index) => (
                        <div key={index} className="bg-[var(--color-background-tertiary)] p-4 rounded-lg border border-[var(--color-border-primary)]">
                            <p className="font-bold text-[var(--color-text-primary)]">{concept.title}</p>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{concept.description}</p>
                            <p className="text-xs text-[var(--color-accent-secondary)] mt-2 font-mono bg-black/20 p-1.5 rounded inline-block">{concept.style}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-[var(--color-text-secondary)] py-10">
                    <p>Your selected concepts from this session will appear here.</p>
                </div>
            )}
        </div>
        
        <div className="p-4 border-t border-[var(--color-border-primary)] text-right">
             <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold transition-all"
            >
                Close
            </button>
        </div>

      </div>
    </div>
  );
};