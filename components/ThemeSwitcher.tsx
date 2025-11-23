import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
    { name: 'dark', icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' },
    { name: 'synthwave', icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v14.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125V4.875z' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--color-background-tertiary)] border border-[var(--color-border-primary)]">
      {themes.map(t => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name as 'light' | 'dark' | 'synthwave')}
          className={`p-1.5 rounded-full transition-colors focus:outline-none ${
            theme === t.name ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-primary)]'
          }`}
          aria-label={`Switch to ${t.name} theme`}
        >
          <Icon path={t.icon} className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};
