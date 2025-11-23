import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { AppView } from '../App';

interface HeaderProps {
  currentView: AppView;
  onSetView: (view: AppView) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

const Logo: React.FC = () => (
    <div className="flex items-center gap-3 cursor-pointer">
        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
            </defs>

            {/* Stardust */}
            <circle cx="85" cy="25" r="0.5" fill="var(--color-text-primary)" opacity="0.7" />
            <circle cx="82" cy="18" r="1" fill="var(--color-text-primary)" opacity="0.5" />
            <circle cx="90" cy="22" r="0.75" fill="var(--color-text-primary)" opacity="0.6" />
            <circle cx="78" cy="28" r="1.25" fill="var(--color-text-primary)" opacity="0.4" />
            <circle cx="88" cy="30" r="0.5" fill="var(--color-text-primary)" opacity="0.8" />
            <circle cx="80" cy="24" r="0.75" fill="var(--color-text-primary)" opacity="0.5" />


            {/* Orbit */}
            <path d="M 22 78 A 45 45 0 0 1 88 32" fill="none" stroke="var(--color-border-primary)" strokeWidth="1" />
            <path d="M 28 84 A 50 50 0 0 1 92 38" fill="none" stroke="url(#logo-gradient)" strokeWidth="1.5" />

            {/* Reel */}
            <circle cx="50" cy="50" r="28" fill="var(--color-background-secondary)" stroke="var(--color-border-primary)" strokeWidth="3" />
            <circle cx="50" cy="50" r="25" fill="var(--color-background-secondary)" stroke="var(--color-text-primary)" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.6"/>
            <circle cx="50" cy="50" r="8" fill="var(--color-background)" stroke="var(--color-border-primary)" strokeWidth="1" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                <circle
                    key={a}
                    cx={50 + 17 * Math.cos(a * Math.PI / 180)}
                    cy={50 + 17 * Math.sin(a * Math.PI / 180)}
                    r="4"
                    fill="var(--color-background)"
                />
            ))}
             <circle cx="50" cy="50" r="28" fill="none" stroke="var(--color-background)" strokeWidth="1.5" />

        </svg>
        <div className="font-heading font-bold text-[var(--color-text-primary)] text-lg leading-tight hidden md:block whitespace-nowrap">
            CONTENT CREATOR <span className="text-transparent bg-clip-text bg-[var(--gradient-primary)]">AI</span>
        </div>
    </div>
);

const NavButton: React.FC<{
  label: string;
  iconPath: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, iconPath, isActive, onClick }) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-2.5 rounded-full transition-colors duration-200 ${
        isActive
          ? 'bg-[var(--color-primary)] text-white'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]'
      }`}
    >
        <Icon path={iconPath} className="w-6 h-6" />
    </button>
);


export const Header: React.FC<HeaderProps> = ({ currentView, onSetView, onOpenProfile, onOpenSettings }) => {
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

  return (
    <header className="w-full max-w-7xl mx-auto flex justify-between items-center gap-4">
      <button onClick={() => onSetView('creator')} aria-label="Go to Creator view and reset project">
        <Logo />
      </button>

      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-lg relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <input
                type="search"
                placeholder="Search assets and concepts..."
                className="w-full bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] transition-all"
            />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <NavButton label="Browse" iconPath="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" isActive={currentView === 'browse'} onClick={() => onSetView('browse')} />
        
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-11 h-11 flex items-center justify-center bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)] border border-[var(--color-border-primary)] rounded-full transition-colors"
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
                <button
                  onClick={() => handleMenuClick('settings')}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]"
                  role="menuitem"
                >
                  <Icon path="M10.343 3.94c.09-.542.56-1.003 1.11-1.226M10.343 3.94a3.75 3.75 0 01-5.714 0m5.714 0a3.75 3.75 0 00-5.714 0M12 21.75a3.75 3.75 0 005.714 0m-5.714 0a3.75 3.75 0 01-5.714 0M12 21.75c-2.13 0-4.14-.834-5.657-2.343M12 21.75c2.13 0 4.14-.834 5.657-2.343m-11.314 0a3.75 3.75 0 010-5.304M17.657 5.05a3.75 3.75 0 010 5.304m0 0a3.75 3.75 0 01-5.304 0m5.304 0a3.75 3.75 0 00-5.304 0M3.94 10.343a3.75 3.75 0 010-5.304m0 5.304a3.75 3.75 0 000 5.304m13.717-5.304a3.75 3.75 0 010 5.304m0-5.304a3.75 3.75 0 000-5.304m-5.304 5.304a3.75 3.75 0 01-5.304 0m5.304 0a3.75 3.75 0 00-5.304 0" className="w-5 h-5" />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};