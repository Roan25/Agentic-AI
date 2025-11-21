import React, { useRef, useEffect } from 'react';
import { GeneratedCampaign } from '../types';
import { Icon } from './Icon';

interface MediaModalProps {
  campaign: GeneratedCampaign | null;
  onClose: () => void;
}

const IconButton: React.FC<{ onClick: (e: React.MouseEvent) => void; path: string; label: string }> = ({ onClick, path, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="p-2 rounded-full bg-gray-800/70 text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <Icon path={path} className="w-6 h-6" />
  </button>
);

export const MediaModal: React.FC<MediaModalProps> = ({ campaign, onClose }) => {
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!campaign) {
    return null;
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = campaign.mediaUrl;
    const fileExtension = campaign.format === 'video' ? 'mp4' : 'png';
    const fileName = `${campaign.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mediaRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-full max-h-[90vh] p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex-grow relative">
            {campaign.format === 'image' ? (
               <img
                ref={mediaRef as React.RefObject<HTMLImageElement>}
                src={campaign.mediaUrl}
                alt={campaign.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={campaign.mediaUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
              />
            )}
          </div>

          <div className="flex-shrink-0 flex items-center justify-center gap-4">
            <IconButton onClick={handleDownload} path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" label="Download media" />
            <IconButton onClick={handleFullscreen} path="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" label="Toggle fullscreen" />
            <IconButton onClick={onClose} path="M6 18L18 6M6 6l12 12" label="Close modal" />
          </div>

          <div className="flex-shrink-0 text-center text-white bg-gray-900/50 p-4 rounded-lg">
            <h2 id="media-modal-title" className="text-xl font-bold">{campaign.title}</h2>
            <p className="text-gray-300 mt-1">{campaign.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};