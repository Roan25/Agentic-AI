
import React from 'react';

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      {text && <p className="mt-4 text-lg text-gray-300">{text}</p>}
    </div>
  );
};
