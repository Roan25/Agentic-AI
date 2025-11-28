import React from 'react';
import { ShowcaseStyle } from '../types';
import { type AppView } from '../App';

interface AppBackgroundProps {
    view: AppView;
    showcaseStyle: ShowcaseStyle;
}

const NebulaBackground: React.FC = () => (
    <>
        <style>
            {`
                @keyframes float-fog {
                    0% { transform: translate(0, 0) scale(1.5); }
                    50% { transform: translate(-50px, 30px) scale(1.8); }
                    100% { transform: translate(20px, -20px) scale(1.5); }
                }
                .bg-fog-layer {
                    position: absolute;
                    inset: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 60%);
                    mix-blend-mode: screen;
                    filter: blur(80px);
                    animation: float-fog 30s ease-in-out infinite alternate;
                }
                .bg-accent-glow {
                     position: absolute;
                     top: 20%;
                     right: 10%;
                     width: 40vw;
                     height: 40vw;
                     background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
                     filter: blur(100px);
                     animation: float-fog 45s ease-in-out infinite alternate-reverse;
                }
            `}
        </style>
        <div className="bg-fog-layer"></div>
        <div className="bg-accent-glow"></div>
        {/* Subtle Noise Texture for realism */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </>
);

const GridBackground: React.FC = () => (
    <div className="absolute inset-0" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
    }}></div>
);

export const AppBackground: React.FC<AppBackgroundProps> = ({ view, showcaseStyle }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden bg-[var(--color-background)] pointer-events-none">
            {view === 'creator' ? <NebulaBackground /> : <GridBackground />}
        </div>
    );
};