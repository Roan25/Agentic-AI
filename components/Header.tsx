import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  onReset: () => void;
  hasContent: boolean;
  currentView: 'creator' | 'tester' | 'ops';
  onSetView: (view: 'creator' | 'tester' | 'ops') => void;
  onOpenProfile: () => void;
}

const Logo: React.FC = () => (
    <div className="flex items-center gap-3">
       <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-grad-main" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--color-primary)"/>
                    <stop offset="1" stopColor="var(--color-accent)"/>
                </linearGradient>
                 <linearGradient id="logo-grad-glow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--color-accent)"/>
                    <stop offset="1" stopColor="var(--color-primary)"/>
                </linearGradient>
            </defs>
            {/* Retro TV Shape */}
            <path d="M40 10H8C5.79086 10 4 11.7909 4 14V34C4 36.2091 5.79086 38 8 38H40C42.2091 38 44 36.2091 44 34V14C44 11.7909 42.2091 10 40 10Z" stroke="url(#logo-grad-main)" strokeWidth="2.5"/>
            {/* Screen Glow */}
            <path d="M36 16H12C11.4477 16 11 16.4477 11 17V31C11 31.5523 11.4477 32 12 32H36C36.5523 32 37 31.5523 37 31V17C37 16.4477 36.5523 16 36 16Z" fill="url(#logo-grad-glow)" fillOpacity="0.1"/>
             {/* VR Headset Shape */}
            <path d="M29 20C29 18.8954 30.3431 18 32 18H34C35.1046 18 36 18.8954 36 20V28C36 29.1046 35.1046 30 34 30H32C30.3431 30 29 29.1046 29 28V20Z" stroke="url(#logo-grad-main)" strokeWidth="1.5" />
            <path d="M19 20C19 18.8954 17.6569 18 16 18H14C12.8954 18 12 18.8954 12 20V28C12 29.1046 12.8954 30 14 30H16C17.6569 30 19 29.1046 19 28V20Z" stroke="url(#logo-grad-main)" strokeWidth="1.5" />
             {/* AI text */}
            <text x="24" y="27" fontFamily="var(--font-heading)" fontSize="10" fill="url(#logo-grad-main)" textAnchor="middle" fontWeight="bold">AI</text>
        </svg>

        <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]" style={{fontFamily: 'var(--font-heading)'}}>
                Content Creator AI
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
                Powered by Gemini
            </p>
        </div>
    </div>
);


export const Header: React.FC<HeaderProps> = ({ onReset, hasContent, currentView, onSetView, onOpenProfile }) => {
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

  const handleMenuClick = (action: 'ops' | 'tester' | 'profile') => {
    if (action === 'ops') onSetView('ops');
    if (action === 'tester') onSetView('tester');
    if (action === 'profile') onOpenProfile();
    setIsProfileOpen(false);
  }

  return (
    <header className="w-full max-w-7xl mx-auto flex justify-between items-center">
      <button onClick={onReset} aria-label="Go to Creator view and reset project">
        <Logo />
      </button>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {(hasContent || currentView !== 'creator') && (
          <button
            onClick={onReset}
            className="bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            + New Project
          </button>
        )}
        
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 flex items-center justify-center bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)] border border-[var(--color-border-primary)] rounded-full transition-colors"
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            aria-label="Open user menu"
          >
            <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-6 h-6" />
          </button>

          {isProfileOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 origin-top-right bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
              role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
            >
              <div className="py-1">
                 <button
                  onClick={() => handleMenuClick('profile')}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]"
                  role="menuitem"
                >
                  <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-5 h-5" />
                  My Profile
                </button>
                 <div className="border-t border-[var(--color-border-primary)] my-1"></div>
                <button
                  onClick={() => handleMenuClick('ops')}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]"
                  role="menuitem"
                >
                  <Icon path="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 18h.008v.008H3.75V18zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="w-5 h-5" />
                  AgentOps Dashboard
                </button>
                <button
                  onClick={() => handleMenuClick('tester')}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]"
                  role="menuitem"
                >
                  <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                  Agent Evaluations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};