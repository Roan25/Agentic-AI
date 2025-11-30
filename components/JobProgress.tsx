
import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { useAsyncJob } from '../hooks/useAsyncJob';

interface JobProgressProps {
  jobId?: string;
  status?: string; // Initial status from parent
  onJobComplete?: (url: string) => void;
}

export const JobProgress: React.FC<JobProgressProps> = ({ jobId, status: initialStatus, onJobComplete }) => {
  // Hook handles all the polling logic and state management
  const { status, progress, resultUrl, error } = useAsyncJob(jobId, onJobComplete);

  // Determine display status (prefer hook status over initial prop once polling starts)
  const currentStatus = status === 'PENDING' && initialStatus ? initialStatus : status;

  return (
    <div className="w-full bg-[var(--color-background-tertiary)]/50 border border-[var(--color-border-primary)] rounded-lg p-4 flex items-center gap-4">
      {/* Icon Status */}
      <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-500 ${
          currentStatus === 'COMPLETE' 
            ? 'bg-green-500/20 border-green-500/50' 
            : currentStatus === 'FAILED'
            ? 'bg-red-500/20 border-red-500/50'
            : 'bg-[var(--color-background-secondary)] border-[var(--color-border-primary)]'
      }`}>
        {currentStatus === 'COMPLETE' ? (
          <Icon path="M4.5 12.75l6 6 9-13.5" className="w-5 h-5 text-green-400" />
        ) : currentStatus === 'FAILED' ? (
           <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-red-400" />
        ) : (
          <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-[var(--color-text-primary)] truncate pr-2 flex items-center gap-2">
                {currentStatus === 'COMPLETE' ? 'Generation Complete' : 
                 currentStatus === 'FAILED' ? 'Generation Failed' :
                 'Rendering Asset...'}
                 
                 {jobId && <span className="text-[10px] font-mono text-[var(--color-text-secondary)] opacity-50 font-normal">ID: {jobId}</span>}
            </h4>
            <span className="text-xs font-mono text-[var(--color-text-secondary)] whitespace-nowrap">
                {currentStatus === 'COMPLETE' ? '100%' : `${Math.round(progress)}%`}
            </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden relative">
            {/* Animated Progress Bar */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                className={`h-full rounded-full relative overflow-hidden ${
                    currentStatus === 'COMPLETE' ? 'bg-green-500' :
                    currentStatus === 'FAILED' ? 'bg-red-500' :
                    'bg-[var(--gradient-primary)]'
                }`}
            >
                {/* Shimmer Overlay (only when processing) */}
                {currentStatus !== 'COMPLETE' && currentStatus !== 'FAILED' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full animate-[shimmer_1.5s_infinite] translate-x-[-100%]" style={{
                        animationName: 'shimmer',
                        animationDuration: '1.5s',
                        animationIterationCount: 'infinite',
                        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                    }}></div>
                )}
            </motion.div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {currentStatus === 'COMPLETE' ? 'Asset is ready for review.' : 
                 currentStatus === 'FAILED' ? (error || 'Process encountered an error.') :
                 'The swarm is compiling your video...'}
            </p>
            {currentStatus === 'COMPLETE' && resultUrl && (
                <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[10px] uppercase font-bold tracking-wide transition-colors flex items-center gap-1 shadow-lg"
                    onClick={() => onJobComplete && onJobComplete(resultUrl)}
                >
                    View Result <Icon path="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" className="w-3 h-3" />
                </motion.button>
            )}
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
