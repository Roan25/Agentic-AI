import React from 'react';
import { ShowcaseStyle } from '../types';
import { type AppView } from '../App';

interface AppBackgroundProps {
    view: AppView;
    showcaseStyle: ShowcaseStyle;
}

const FluidBackground: React.FC = () => (
    <>
        <style>
            {`
                @keyframes move-blob-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30vw, -40vh) scale(1.2); }
                    50% { transform: translate(-20vw, 20vh) scale(0.8); }
                    75% { transform: translate(10vw, 30vh) scale(1.1); }
                }
                @keyframes move-blob-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(-25vw, 30vh) scale(1.1); }
                    50% { transform: translate(30vw, -10vh) scale(1.3); }
                    75% { transform: translate(-15vw, -25vh) scale(0.9); }
                }
                @keyframes move-blob-3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20vw, 20vh) scale(0.9); }
                    50% { transform: translate(-30vw, -30vh) scale(1.2); }
                    75% { transform: translate(25vw, -15vh) scale(1.1); }
                }
                .blob {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: 150% 150%;
                    opacity: 0.6;
                    will-change: transform;
                }
            `}
        </style>
        <div 
            className="blob" 
            style={{ 
                backgroundImage: 'radial-gradient(circle at 20% 20%, var(--color-primary) 0%, transparent 40%)',
                animation: 'move-blob-1 45s infinite ease-in-out alternate',
            }}
        ></div>
        <div 
            className="blob" 
            style={{ 
                backgroundImage: 'radial-gradient(circle at 80% 30%, var(--color-accent) 0%, transparent 35%)',
                animation: 'move-blob-2 55s infinite ease-in-out alternate',
                animationDelay: '-10s',
            }}
        ></div>
        <div 
            className="blob" 
            style={{ 
                backgroundImage: 'radial-gradient(circle at 50% 80%, var(--color-accent-secondary) 0%, transparent 30%)',
                animation: 'move-blob-3 65s infinite ease-in-out alternate',
                animationDelay: '-20s',
            }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-background)] opacity-70"></div>
    </>
);

const GridBackground: React.FC<{color?: string}> = ({ color }) => (
    <>
        <style>
            {`
                @keyframes move-grid {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 100px; }
                }
                .grid-container {
                    width: 100%;
                    height: 100%;
                    background: var(--color-background);
                    perspective: 400px;
                }
                .grid-plane {
                    width: 100%;
                    height: 100%;
                    transform: rotateX(75deg);
                    background-image:
                        linear-gradient(to right, var(--grid-color, var(--color-primary)) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color, var(--color-primary)) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: move-grid 4s linear infinite;
                    position: relative;
                }
                .grid-plane::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, transparent 0%, var(--color-background) 70%);
                }
            `}
        </style>
        <div className="grid-container">
            <div className="grid-plane" style={{'--grid-color': color} as React.CSSProperties}></div>
        </div>
    </>
);

const DoodleBackground: React.FC = () => (
    <>
        <style>
            {`
                @keyframes move-doodle {
                    0% { background-position: 0 0; }
                    100% { background-position: 200px 200px; }
                }
                .doodle-bg {
                    width: 100%;
                    height: 100%;
                    background-color: var(--color-background);
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><g fill="none" stroke="%23${'a1a1aa'}" stroke-width="1"><path d="M10 10 C 20 20, 40 20, 50 10" /><path d="M20,80 Q40,60 60,80 T100,80" /><circle cx="80" cy="20" r="5"/><rect x="40" y="40" width="10" height="10" transform="rotate(45 45 45)"/></g></svg>');
                    background-size: 100px 100px;
                    opacity: 0.1;
                    animation: move-doodle 10s linear infinite;
                }
            `}
        </style>
        <div className="doodle-bg"></div>
    </>
);

const VintageBackground: React.FC = () => (
     <>
        <style>
            {`
                @keyframes flicker {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.3; }
                }
                @keyframes grain {
                  0%, 100% { transform: translate(0, 0); }
                  10% { transform: translate(-5%, -10%); }
                  20% { transform: translate(-15%, 5%); }
                  30% { transform: translate(7%, -25%); }
                  40% { transform: translate(-5%, 25%); }
                  50% { transform: translate(-15%, 10%); }
                  60% { transform: translate(15%, 0%); }
                  70% { transform: translate(0%, 15%); }
                  80% { transform: translate(3%, 35%); }
                  90% { transform: translate(-10%, 10%); }
                }
                .vintage-container {
                    width: 100%;
                    height: 100%;
                    background-color: #BDB5A4;
                    position: relative;
                    overflow: hidden;
                    filter: sepia(0.3) contrast(1.1) brightness(0.9);
                }
                .vintage-flicker {
                    position: absolute;
                    inset: 0;
                    background-color: black;
                    animation: flicker 0.2s infinite;
                }
                 .vintage-grain {
                    position: absolute;
                    top: -50%; left: -50%;
                    right: -50%; bottom: -50%;
                    width: 200%;
                    height: 200%;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiGAAAAA1BMVEXm5+i+5+AnAAAAGElEQVR42mP4z8BQz8DNgGjFo4aB4RYA+dECpi3iAx4AAAAASUVORK5CYII=');
                    animation: grain 8s steps(10, end) infinite;
                    opacity: 0.1;
                }
            `}
        </style>
        <div className="vintage-container">
            <div className="vintage-flicker"></div>
            <div className="vintage-grain"></div>
        </div>
    </>
);

const CreatorBackground: React.FC<{ style: ShowcaseStyle }> = ({ style }) => {
    switch (style) {
        case 'grid': return <GridBackground />;
        case 'doodle': return <DoodleBackground />;
        case 'vintage': return <VintageBackground />;
        case 'fluid': default: return <FluidBackground />;
    }
};

const BrowseBackground: React.FC = () => (
    <>
        <style>
            {`
                @keyframes move-stars {
                    from { transform: translateY(0); }
                    to { transform: translateY(-2000px); }
                }
                .stars-bg {
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
                    overflow: hidden;
                }
                .stars-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .stars {
                    background: black url(https://www.transparenttextures.com/patterns/stardust.png) repeat top center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 200%;
                    display: block;
                    animation: move-stars 120s linear infinite;
                }
                .stars2 {
                    animation-duration: 80s;
                    opacity: 0.6;
                }
                .stars3 {
                    animation-duration: 60s;
                    opacity: 0.4;
                }
            `}
        </style>
        <div className="stars-bg">
            <div className="stars-container">
                <div className="stars"></div>
                <div className="stars stars2"></div>
                <div className="stars stars3"></div>
            </div>
        </div>
    </>
);

const OpsBackground: React.FC = () => <GridBackground color="var(--color-text-accent)" />;

const TesterBackground: React.FC = () => (
    <>
        <style>
        {`
            .tester-bg {
                width: 100%;
                height: 100%;
                background-color: var(--color-background);
                background-image: radial-gradient(var(--color-border-primary) 1px, transparent 1px);
                background-size: 1.5rem 1.5rem;
                opacity: 0.5;
            }
        `}
        </style>
        <div className="tester-bg"></div>
    </>
);

export const AppBackground: React.FC<AppBackgroundProps> = ({ view, showcaseStyle }) => {
    const renderBackground = () => {
        switch (view) {
            case 'browse': return <BrowseBackground />;
            case 'ops': return <OpsBackground />;
            case 'tester': return <TesterBackground />;
            case 'creator': default: return <CreatorBackground style={showcaseStyle} />;
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden" aria-hidden="true">
            {renderBackground()}
        </div>
    );
};