import React, { useState, useMemo, useEffect } from 'react';
import { CreativeConcept } from '../types';
import { Icon } from './Icon';
import { Dropdown } from './Dropdown';

export interface Filters {
  style: string;
  duration: string;
  keyword: string;
}

interface FilterMenuProps {
  concepts: CreativeConcept[];
  onFilterChange: (filters: Filters) => void;
}

const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: 'short', label: '< 15s' },
    { value: 'medium', label: '15-30s' },
    { value: 'long', label: '> 30s' },
];

export const FilterMenu: React.FC<FilterMenuProps> = ({ concepts, onFilterChange }) => {
    const [style, setStyle] = useState('all');
    const [duration, setDuration] = useState('all');
    const [keyword, setKeyword] = useState('');

    const styleOptions = useMemo(() => {
        const styles = new Set(concepts.map(c => c.style).filter(Boolean));
        const options = Array.from(styles).map(s => ({ value: s, label: s }));
        return [{ value: 'all', label: 'All Styles' }, ...options];
    }, [concepts]);

    useEffect(() => {
        onFilterChange({ style, duration, keyword });
    }, [style, duration, keyword, onFilterChange]);
    
    const showDurationFilter = useMemo(() => concepts.some(c => c.duration_seconds !== undefined && c.duration_seconds !== null), [concepts]);

    return (
        <div className="mb-6 bg-[var(--color-background-secondary)]/50 backdrop-blur-sm border border-[var(--color-border-primary)] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
            <h3 className="text-md font-semibold text-[var(--color-text-secondary)] mr-4 flex-shrink-0">Filter By:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <Dropdown
                    label="Style"
                    options={styleOptions}
                    value={style}
                    onChange={(v) => setStyle(v)}
                />
                
                {showDurationFilter && (
                    <Dropdown
                        label="Duration"
                        options={durationOptions}
                        value={duration}
                        onChange={(v) => setDuration(v)}
                    />
                )}
                
                <div className="relative">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] absolute -top-4 left-1">Keyword</span>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search title..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-background-tertiary)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-accent)]"
                        />
                        <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-[var(--color-text-secondary)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};