import React from 'react';
import { Icon } from './Icon';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ShowcaseStyleSwitcher } from './ShowcaseStyleSwitcher';
import { AppView } from '../App';

interface SettingsModalProps {
  onClose: () => void;
  onSetView: (view: AppView) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSetView }) => {
  const handleNavigate = (view: AppView) => {
    onSetView(view);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl shadow-2xl max-w-lg w-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[var(--color-border-primary)] flex items-center justify-between">
             <h2 id="settings-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                <Icon path="M10.343 3.94c.09-.542.56-1.003 1.11-1.226M10.343 3.94a3.75 3.75 0 01-5.714 0m5.714 0a3.75 3.75 0 00-5.714 0M12 21.75a3.75 3.75 0 005.714 0m-5.714 0a3.75 3.75 0 01-5.714 0M12 21.75c-2.13 0-4.14-.834-5.657-2.343M12 21.75c2.13 0 4.14-.834 5.657-2.343m-11.314 0a3.75 3.75 0 010-5.304M17.657 5.05a3.75 3.75 0 010 5.304m0 0a3.75 3.75 0 01-5.304 0m5.304 0a3.75 3.75 0 00-5.304 0M3.94 10.343a3.75 3.75 0 010-5.304m0 5.304a3.75 3.75 0 000 5.304m13.717-5.304a3.75 3.75 0 010 5.304m0-5.304a3.75 3.75 0 000-5.304m-5.304 5.304a3.75 3.75 0 01-5.304 0m5.304 0a3.75 3.75 0 00-5.304 0" className="h-6 w-6" />
                Settings
            </h2>
            <button
                onClick={onClose}
                className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)]"
                aria-label="Close settings modal"
            >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-md font-semibold text-left text-[var(--color-text-accent)] mb-3">Appearance</h3>
                <div className="bg-[var(--color-background-tertiary)] p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--color-text-secondary)]">Interface Theme</p>
                        <ThemeSwitcher />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--color-text-secondary)]">Showcase Style</p>
                        <ShowcaseStyleSwitcher />
                    </div>
                </div>
            </div>
             <div>
                <h3 className="text-md font-semibold text-left text-[var(--color-text-accent)] mb-3">Advanced</h3>
                <div className="bg-[var(--color-background-tertiary)] p-4 rounded-lg space-y-3">
                     <button onClick={() => handleNavigate('ops')} className="w-full text-left flex items-center gap-3 p-3 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                        <Icon path="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 18h.008v.008H3.75V18zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="w-5 h-5" />
                        AgentOps Dashboard
                    </button>
                    <button onClick={() => handleNavigate('tester')} className="w-full text-left flex items-center gap-3 p-3 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                       <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                        Agent Evaluations
                    </button>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-[var(--color-border-primary)] text-right bg-[var(--color-background)] rounded-b-xl">
             <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold transition-all"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};
