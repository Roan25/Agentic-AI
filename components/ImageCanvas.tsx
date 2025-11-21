import React, { useState } from 'react';
import { type GeneratedCampaign, type CreativeConcept } from '../types';
import { MediaModal } from './ImageModal';
import { Icon } from './Icon';

interface MediaCanvasProps {
  campaigns: GeneratedCampaign[];
  concepts: CreativeConcept[];
  onSelectConcept: (concept: CreativeConcept) => void;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center m-auto">
    <h2 className="text-3xl font-bold text-gray-200">Start Your Creation</h2>
    <p className="text-gray-400 mt-2">Use the prompt bar below to bring your ideas to life.</p>
  </div>
);

const ConceptCard: React.FC<{ concept: CreativeConcept; onSelect: () => void; }> = ({ concept, onSelect }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
      <h3 className="text-lg font-bold text-cyan-300">{concept.title}</h3>
      <p className="text-sm text-gray-300 mt-2 flex-grow">{concept.description}</p>
      <p className="text-xs text-fuchsia-300 mt-4 font-mono bg-black/20 p-2 rounded">{concept.style}</p>
      <button 
        onClick={onSelect}
        className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-opacity flex items-center justify-center gap-2"
      >
        <Icon path="M11.35 1.5A1.5 1.5 0 009.5 3v1.5H3a1.5 1.5 0 000 3h6.5V9a1.5 1.5 0 002.35 1.25l8-4a1.5 1.5 0 000-2.5l-8-4z" className="w-5 h-5" />
        Select & Generate
      </button>
    </div>
  );
};

const GeneratedMediaItem: React.FC<{ campaign: GeneratedCampaign; onClick: () => void }> = ({ campaign, onClick }) => {
  return (
    <div 
      className="relative overflow-hidden rounded-lg group border border-gray-700 cursor-pointer aspect-[16/9]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick()}}
      aria-label={`View details for ${campaign.title}`}
    >
      {campaign.format === 'image' ? (
        <img
          src={campaign.mediaUrl}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      ) : (
         <video
          src={campaign.mediaUrl}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <h3 className="font-bold text-white text-lg">{campaign.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2">{campaign.description}</p>
      </div>
    </div>
  );
};


export const MediaCanvas: React.FC<MediaCanvasProps> = ({ campaigns, concepts, onSelectConcept }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<GeneratedCampaign | null>(null);
  
  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  const renderContent = () => {
    if (campaigns.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <GeneratedMediaItem 
              key={campaign.id} 
              campaign={campaign} 
              onClick={() => setSelectedCampaign(campaign)} 
            />
          ))}
        </div>
      );
    }
    
    if (concepts.length > 0) {
      return (
         <div>
          <h2 className="text-xl text-center font-semibold mb-4 text-gray-300">Step 1: Select a Creative Concept</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {concepts.map((concept) => (
              <ConceptCard 
                key={concept.id}
                concept={concept}
                onSelect={() => onSelectConcept(concept)}
              />
            ))}
          </div>
        </div>
      );
    }
    
    return <WelcomeMessage />;
  };
  
  return (
    <>
      <div className="flex-grow w-full pb-48"> 
        {renderContent()}
      </div>
      <MediaModal 
        campaign={selectedCampaign} 
        onClose={handleCloseModal} 
      />
    </>
  );
};
