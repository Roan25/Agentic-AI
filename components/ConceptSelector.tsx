import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreativeConcept } from '../types';
import { Icon } from './Icon';

interface ConceptSelectorProps {
  data: {
    concepts: CreativeConcept[];
  };
  onSelect: (concept: CreativeConcept) => void;
}

// Animated Radial Compliance Score
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  
  // Color logic based on score
  const getColor = (s: number) => {
      if (s >= 8) return 'text-emerald-400';
      if (s >= 5) return 'text-amber-400';
      return 'text-rose-400';
  };
  const colorClass = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center gap-1">
        <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                cx="24"
                cy="24"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
                />
                {/* Animated Progress Circle */}
                <motion.circle
                cx="24"
                cy="24"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={colorClass}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <span className={`absolute text-xs font-bold font-mono ${colorClass}`}>{score}</span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-secondary)] opacity-80">Score</span>
    </div>
  );
};

export const ConceptSelector: React.FC<ConceptSelectorProps> = ({ data, onSelect }) => {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  return (
    <div className="w-full my-4">
      <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[var(--color-primary)] rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
          <h3 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Select Concept Strategy
          </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.concepts.map((concept) => {
            const isSelected = selectedId === concept.id;
            const score = concept.score || concept.evaluation?.score || 0;

            return (
                <motion.div
                    key={concept.id}
                    layoutId={`concept-card-${concept.id}`}
                    onClick={() => setSelectedId(concept.id)}
                    className={`
                        relative p-1 rounded-2xl cursor-pointer group transition-all duration-300
                        ${isSelected ? 'z-10' : 'z-0'}
                    `}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, zIndex: 5 }}
                >
                    {/* Glowing Border Container */}
                    <div className={`
                        absolute inset-0 rounded-2xl bg-gradient-to-br transition-opacity duration-300
                        ${isSelected 
                            ? 'from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] opacity-100' 
                            : 'from-white/10 to-white/5 opacity-0 group-hover:opacity-100 group-hover:from-[var(--color-accent)]/50'}
                    `}></div>
                    
                    {/* Card Content */}
                    <div className="relative h-full bg-[var(--color-background-glass)] backdrop-blur-xl rounded-xl border border-[var(--color-border-primary)] p-6 flex flex-col gap-4 overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h4 className="text-lg font-bold font-heading text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-text-accent)] transition-colors">
                                    {concept.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                     <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                                        {concept.style}
                                     </span>
                                     {concept.duration_seconds && (
                                         <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                                            {concept.duration_seconds}s
                                         </span>
                                     )}
                                </div>
                            </div>
                            <ScoreRing score={score} />
                        </div>

                        {/* Visual Description Preview */}
                         <div className="relative">
                            <p className={`text-sm font-light text-[var(--color-text-secondary)] leading-relaxed ${isSelected ? '' : 'line-clamp-4'}`}>
                                {concept.description}
                            </p>
                            {!isSelected && (
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[rgba(24,24,27,0.9)] to-transparent"></div>
                            )}
                         </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                         <p className="text-xs text-[var(--color-text-secondary)] font-mono mb-2 uppercase tracking-widest">Script Preview</p>
                                         <div className="bg-black/30 rounded-lg p-3 text-xs text-gray-300 font-mono italic border-l-2 border-[var(--color-accent)]">
                                            "{concept.script?.slice(0, 150)}{concept.script && concept.script.length > 150 ? '...' : ''}"
                                         </div>
                                    </div>
                                    
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect(concept);
                                        }}
                                        className="w-full mt-6 py-3 rounded-lg bg-[var(--gradient-primary)] text-white font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" className="w-5 h-5" />
                                        GENERATE ASSET
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hover Prompt (Hidden if selected) */}
                        {!isSelected && (
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center text-[var(--color-text-accent)] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to View Details
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
};