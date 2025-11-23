import React from 'react';
import { Icon } from './Icon';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  iconPath: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, iconPath }) => {
  return (
    <div className="bg-[var(--color-background-secondary)]/80 border border-[var(--color-border-primary)] rounded-lg p-6 flex items-start gap-4">
       <div className="bg-[var(--gradient-primary)] p-3 rounded-lg">
            <Icon path={iconPath} className="w-6 h-6 text-white" />
       </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">{title}</h3>
        <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
          {value}
          <span className="text-lg font-medium text-[var(--color-text-secondary)] ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
};