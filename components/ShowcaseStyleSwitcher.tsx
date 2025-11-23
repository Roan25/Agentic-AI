import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';
import { ShowcaseStyle } from '../types';

export const ShowcaseStyleSwitcher: React.FC = () => {
  const { showcaseStyle, setShowcaseStyle } = useTheme();

  const styles: { name: ShowcaseStyle; icon: string; label: string }[] = [
    { name: 'fluid', icon: 'M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008H12v-.008zM10.5 12L5.25 21M3 21h3.75m10.5-18L10.5 9M15 3h3.75m-3.75 0L10.5 9', label: 'Fluid' },
    { name: 'grid', icon: 'M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Grid' },
    { name: 'doodle', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125', label: 'Doodle' },
    { name: 'vintage', icon: 'M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0014.25 7.5h-.75m-6 0V6a2.25 2.25 0 012.25-2.25h3A2.25 2.25 0 0115 6v1.5m-6 0h6', label: 'Vintage' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--color-background-tertiary)] border border-[var(--color-border-primary)]">
      {styles.map(s => (
        <button
          key={s.name}
          onClick={() => setShowcaseStyle(s.name)}
          className={`p-1.5 rounded-full transition-colors focus:outline-none ${
            showcaseStyle === s.name ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-primary)]'
          }`}
          aria-label={`Switch to ${s.label} showcase style`}
          title={s.label}
        >
          <Icon path={s.icon} className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};