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
    <div className="relative" ref={dropdownRef}>
      <span className="text-xs font-semibold text-[var(--color-text-secondary)] absolute -top-4 left-1">{label}</span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-background-tertiary)] rounded-md hover:bg-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>{selectedOption?.label}</span>
        <svg className={`w-5 h-5 ml-2 -mr-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 origin-bottom-right bottom-full mb-2 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option.value}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                className={`block px-4 py-2 text-sm ${
                  option.value === value ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]'
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