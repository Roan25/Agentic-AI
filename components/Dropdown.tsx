import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps<T> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  label: string;
}

export const Dropdown = <T extends string>({ options, value, onChange, disabled, label }: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] absolute -top-5 left-0">{label}</span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center justify-between w-full px-3 py-2 text-sm text-[var(--color-text-primary)] bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed min-w-[120px]"
      >
        <span>{selectedOption?.label}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 text-[var(--color-text-secondary)] ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 origin-top bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5 animate-fade-in">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option.value}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                className={`block px-4 py-2 text-sm transition-colors ${
                  option.value === value ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white'
                }`}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};