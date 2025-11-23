import React, { useState, useMemo, useCallback } from 'react';
import { type GeneratedCampaign, type CreativeConcept, UiComponent, UiComponentType, ComponentData } from '../types';
import { MediaModal } from './ImageModal';
import { Icon } from './Icon';
import { FilterMenu, type Filters } from './FilterMenu';
import { StatusBar } from './StatusBar';

interface ControlPlaneProps {
  campaigns: GeneratedCampaign[];
  uiComponents: UiComponent[];
  onSelectConcept: (concept: CreativeConcept) => void;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center m-auto">
    <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Start Your Creation</h2>
    <p className="text-[var(--color-text-secondary)] mt-2">Use the prompt bar below to bring your ideas to life.</p>
  </div>
);

const ConceptCard: React.FC<{ concept: CreativeConcept; onSelect: () => void; isRecommended: boolean; }> = ({ concept, onSelect, isRecommended }) => {
  const score = concept.evaluation?.score ?? 0;
  const scoreColor = 
    score >= 8 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
    score >= 5 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
    'bg-red-500/20 text-red-300 border-red-500/30';

  return (
    <div className="bg-[var(--color-background-secondary)]/70 border border-[var(--color-border-primary)] rounded-lg p-6 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 relative hover:border-[var(--color-accent)]/50">
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-[var(--gradient-primary)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          Recommended
        </div>
      )}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-[var(--color-text-accent)] flex-grow pr-2">{concept.title}</h3>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {concept.duration_seconds && (
            <span className="text-xs bg-[var(--color-background-tertiary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">
              {concept.duration_seconds}s
            </span>
          )}
          {concept.evaluation && (
             <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${scoreColor}`}>
                Score: {score}/10
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mt-2 flex-grow">{concept.description}</p>
      <p className="text-xs text-[var(--color-accent)] mt-4 font-mono bg-black/20 p-2 rounded">{concept.style}</p>
      <button 
        onClick={onSelect}
        className="mt-4 w-full bg-[var(--gradient-primary)] hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
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
      className="relative overflow-hidden rounded-lg group border border-[var(--color-border-primary)] cursor-pointer aspect-[16/9]"
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
      ) : campaign.format === 'video' ? (
         <video
          src={campaign.mediaUrl}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div className="w-full h-full bg-[var(--color-background-secondary)] flex flex-col items-center justify-center p-4">
           <Icon path="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" className="w-16 h-16 text-[var(--color-accent)]" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <h3 className="font-bold text-white text-lg">{campaign.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2">{campaign.description}</p>
      </div>
    </div>
  );
};


export const ControlPlane: React.FC<ControlPlaneProps> = ({ campaigns, uiComponents, onSelectConcept }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<GeneratedCampaign | null>(null);
  const [filters, setFilters] = useState<Filters>({ style: 'all', duration: 'all', keyword: '' });

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const { statusComponents, selectionCard } = useMemo(() => {
    const statusComponents = uiComponents
      .filter((c) => c.component_type === UiComponentType.ASYNC_STATUS_BAR || c.component_type === UiComponentType.SYSTEM_ALERT);
    
    const selectionCard = uiComponents
      .find((c): c is UiComponent & { component_data: ComponentData & { concepts: CreativeConcept[] } } => c.component_type === UiComponentType.SELECTION_CARD);
      
    return { statusComponents, selectionCard };
  }, [uiComponents]);

  const filteredConcepts = useMemo(() => {
    const concepts = selectionCard?.component_data?.concepts ?? [];
    return concepts.filter(concept => {
      const styleMatch = filters.style === 'all' || concept.style === filters.style;

      const durationMatch = (() => {
        if (filters.duration === 'all') return true;
        const duration = concept.duration_seconds;
        if (duration === undefined || duration === null) {
            return filters.duration === 'all';
        }
        if (filters.duration === 'short') return duration < 15;
        if (filters.duration === 'medium') return duration >= 15 && duration <= 30;
        if (filters.duration === 'long') return duration > 30;
        return true;
      })();

      const keywordMatch = filters.keyword.trim() === '' || 
        concept.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        concept.description.toLowerCase().includes(filters.keyword.toLowerCase());

      return styleMatch && durationMatch && keywordMatch;
    });
  }, [selectionCard, filters]);
  
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
    
    if (uiComponents.length > 0) {
      return (
         <div className="space-y-8">
            {statusComponents.length > 0 && (
                <div className="bg-[var(--color-background-secondary)]/80 border border-[var(--color-border-primary)] rounded-lg p-6 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)] flex items-center gap-2">
                        <Icon path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" className="w-5 h-5" />
                        Agent Control Plane
                    </h2>
                    <div className="space-y-3">
                        {statusComponents.map((bar, index) => <StatusBar key={index} component={bar} />)}
                    </div>
                </div>
            )}
            {selectionCard && (
              <div className="animate-fade-in" style={{ animationDelay: `${statusComponents.length * 100}ms`}}>
                <h2 className="text-xl text-center font-semibold mb-4 text-[var(--color-text-secondary)]">Step 1: Select a Creative Concept</h2>
                <FilterMenu concepts={selectionCard.component_data.concepts ?? []} onFilterChange={handleFilterChange} />
                {filteredConcepts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConcepts.map((concept, index) => (
                      <ConceptCard 
                        key={concept.id}
                        concept={concept}
                        onSelect={() => onSelectConcept(concept)}
                        isRecommended={index === 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-[var(--color-text-secondary)] bg-[var(--color-background-secondary)]/50 rounded-lg">
                      <p className="font-semibold">No concepts match your filter criteria.</p>
                      <p className="text-sm mt-1">Try adjusting your filters to see more results.</p>
                  </div>
                )}
              </div>
            )}
        </div>
      );
    }
    
    return <WelcomeMessage />;
  };
  
  return (
    <>
      <div className="flex-grow w-full pb-56"> 
        {renderContent()}
      </div>
      <MediaModal 
        campaign={selectedCampaign} 
        onClose={handleCloseModal} 
      />
    </>
  );
};