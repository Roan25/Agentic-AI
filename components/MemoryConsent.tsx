import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';

interface MemoryConsentProps {
  pattern?: { style: string };
  onConfirm: () => void;
  onDecline: () => void;
}

export const MemoryConsent: React.FC<MemoryConsentProps> = ({ pattern, onConfirm, onDecline }) => {
  const [interacted, setInteracted] = useState(false);

  const handleAction = (action: 'confirm' | 'decline') => {
      setInteracted(true);
      if (action === 'confirm') onConfirm();
      else onDecline();
  };

  if (interacted) {
      return (
          <div className="text-xs text-[var(--color-text-secondary)] text-center italic">
              Preference logged.
          </div>
      )
  }

  return (
    <div className="w-full bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/30 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-[var(--color-primary)]/20 rounded-full">
            <Icon path="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Pattern Detected</h4>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                You frequently prefer the <strong className="text-[var(--color-text-accent)]">"{pattern?.style || 'Unknown'}"</strong> style. 
                Should I save this to your long-term profile to automate future requests?
            </p>
            
            <div className="flex gap-3 mt-3">
                <button 
                    onClick={() => handleAction('confirm')}
                    className="px-4 py-1.5 rounded text-xs font-bold bg-[var(--color-primary)] text-white hover:opacity-90 shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all"
                >
                    Yes, Save Preference
                </button>
                <button 
                    onClick={() => handleAction('decline')}
                    className="px-4 py-1.5 rounded text-xs font-semibold bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
                >
                    No, thanks
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};