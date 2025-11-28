import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryBadgeProps {
  label: string;
}

export const MemoryBadge: React.FC<MemoryBadgeProps> = ({ label }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Exit after 3 seconds
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        `}
      </style>
      <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ 
                    x: -300, // Fly towards the left sidebar
                    scale: 0.5, 
                    opacity: 0,
                    transition: { duration: 0.5, ease: "backIn" }
                }} 
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="fixed top-24 right-8 z-50 pointer-events-none"
            >
                <div className="relative overflow-hidden rounded-xl border border-purple-500/50 bg-[var(--color-background-secondary)]/90 p-4 shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-md pr-10 min-w-[300px]">
                     
                     {/* Shimmer Effect */}
                     <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                     
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                           🧠
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                                Pattern Learned
                            </div>
                            <div className="font-medium text-[var(--color-text-primary)] text-sm leading-tight">
                                {label.replace('Pattern Saved: ', '')} saved to Profile
                            </div>
                        </div>
                     </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};