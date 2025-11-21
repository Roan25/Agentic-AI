
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  path: string;
}

export const Icon: React.FC<IconProps> = ({ path, className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);
