import React, { useState, useEffect } from 'react';
import { GeneratedCampaign } from '../types';
import { Icon } from './Icon';

interface ContentReelProps {
  campaigns: GeneratedCampaign[];
}

const ReelItem: React.FC<{ campaign: GeneratedCampaign }> = ({ campaign }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative snap-center">
            <div className="w-full max-w-2xl aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl border-4 border-[var(--color-border-primary)]">
                {campaign.format === 'image' ? (
                    <img
                        src={campaign.mediaUrl}
                        alt={campaign.title}
                        className="w-full h-full object-contain"
                    />
                ) : campaign.format === 'video' ? (
                    <video
                        src={campaign.mediaUrl}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        loop
                        muted
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <audio
                            src={campaign.mediaUrl}
                            className="w-full"
                            controls
                            autoPlay
                        />
                    </div>
                )}
            </div>
            <div className="w-full max-w-2xl p-4 bg-[var(--color-background-secondary)]/80 backdrop-blur-md rounded-xl border border-[var(--color-border-primary)]">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-[var(--gradient-primary)]">{campaign.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{campaign.description}</p>
            </div>
        </div>
    );
};


export const ContentReel: React.FC<ContentReelProps> = ({ campaigns }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                setCurrentIndex(prev => Math.min(prev + 1, campaigns.length - 1));
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                setCurrentIndex(prev => Math.max(prev - 1, 0));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [campaigns.length]);

    if (!campaigns || campaigns.length === 0) {
        return (
            <div className="text-center m-auto flex flex-col items-center justify-center h-full">
                <div className="bg-[var(--color-background)]/50 backdrop-blur-md p-8 rounded-xl">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Browse Your Creations</h2>
                    <p className="text-[var(--color-text-secondary)] mt-4 max-w-lg">
                        Generated content will appear here in a scrollable reel.
                        Go to the 'Creator' tab to start a new project!
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full flex flex-col relative pb-24">
            <div className="flex-grow overflow-y-auto snap-y snap-mandatory scroll-smooth"
                 style={{ scrollbarWidth: 'none' }} /* Firefox */
            >
                {campaigns.map((campaign) => (
                    <ReelItem key={campaign.id} campaign={campaign} />
                ))}
            </div>
        </div>
    );
};