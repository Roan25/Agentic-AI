import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { type AppView } from '../App';

interface HeaderProps {
  currentView: AppView;
  onSetView: (view: AppView) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  minimal?: boolean;
}

const Logo: React.FC = () => (
    <div className="flex items-center gap-2 cursor-pointer group">
        <div className="relative w-8 h-8">
             <div className="absolute inset-0 bg-[var(--color-primary)] rounded-lg blur opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
             <div className="relative w-full h-full bg-gradient-to-br from-[var(--color-background-tertiary)] to-black border border-white/10 rounded-lg flex items-center justify-center">
                 <div className="w-3 h-3 bg-[var(--color-text-primary)] rounded-full shadow-[0_0_10px_white]"></div>
             </div>
        </div>
        <div className="font-heading font-bold text-[var(--color-text-primary)] text-lg leading-tight tracking-tight">
            NEBULA<span className="text-[var(--color-primary)]">.AI</span>
        </div>
    </div>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onSetView, onOpenProfile, onOpenSettings, minimal }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (action: 'settings' | 'profile') => {
    if (action === 'settings') onOpenSettings();
    if (action === 'profile') onOpenProfile();
    setIsProfileOpen(false);
  }

  if (minimal) {
      return (
        <header className="flex flex-col gap-6">
            <button onClick={() => onSetView('creator')} className="mb-4">
                <Logo />
            </button>
        </header>
      )
  }

  return (
    <header className="w-full flex justify-between items-center">
      {/* On non-creator pages, show logo */}
      <button onClick={() => onSetView('creator')} aria-label="Home">
        <Logo />
      </button>

      <div className="flex items-center gap-3">
        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center bg-[var(--color-background-tertiary)]/50 p-1 rounded-full border border-white/5 mr-4">
            {(['creator', 'browse', 'tester', 'ops'] as AppView[]).map(view => (
                <button
                    key={view}
                    onClick={() => onSetView(view)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        currentView === view 
                        ? 'bg-[var(--color-background-secondary)] text-white shadow-sm border border-white/5' 
                        : 'text-[var(--color-text-secondary)] hover:text-white'
                    }`}
                >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
            ))}
        </div>

        {/* User Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] p-[1px]">
                 <div className="w-full h-full rounded-full bg-[var(--color-background)] flex items-center justify-center">
                     <span className="font-heading font-bold text-xs text-white">U</span>
                 </div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-2xl py-1 z-50">
                <button onClick={() => handleMenuClick('profile')} className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white flex items-center gap-2">
                    <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-4 h-4" /> Profile
                </button>
                <button onClick={() => handleMenuClick('settings')} className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white flex items-center gap-2">
                    <Icon path="M10.343 3.94c.09-.542.56-1.003 1.11-1.226M10.343 3.94a3.75 3.75 0 01-5.714 0m5.714 0a3.75 3.75 0 00-5.714 0M12 21.75a3.75 3.75 0 005.714 0m-5.714 0a3.75 3.75 0 01-5.714 0M12 21.75c-2.13 0-4.14-.834-5.657-2.343M12 21.75c2.13 0 4.14-.834 5.657-2.343m-11.314 0a3.75 3.75 0 010-5.304M17.657 5.05a3.75 3.75 0 010 5.304m0 0a3.75 3.75 0 01-5.304 0m5.304 0a3.75 3.75 0 00-5.304 0M3.94 10.343a3.75 3.75 0 010-5.304m0 5.304a3.75 3.75 0 000 5.304m13.717-5.304a3.75 3.75 0 010 5.304m0-5.304a3.75 3.75 0 000-5.304m-5.304 5.304a3.75 3.75 0 01-5.304 0m5.304 0a3.75 3.75 0 00-5.304 0" className="w-4 h-4" /> Settings
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};