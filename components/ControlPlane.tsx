
import React, { useState } from 'react';
import { type GeneratedCampaign, type CreativeConcept, UiComponent, Format } from '../types';
import { MediaModal } from './ImageModal';
import { Icon } from './Icon';
import { A2UIRenderer } from './A2UIRenderer';
import { MemoryBadge } from './MemoryBadge';

interface ControlPlaneProps {
  campaigns: GeneratedCampaign[];
  uiComponents: UiComponent[];
  onSelectConcept: (concept: CreativeConcept) => void;
  onDeleteCampaign: (id: string | number) => void;
  format?: Format;
}

const WelcomeMessage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-fade-in mt-10">
    <div className="relative group">
        <div className="absolute -inset-1 rounded-full blur-3xl bg-[var(--color-primary)] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 animate-pulse"></div>
        <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" className="w-24 h-24 text-[var(--color-text-primary)] relative z-10" />
    </div>
    <h1 className="text-5xl md:text-7xl font-bold mt-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 font-heading">
      Create Reality.
    </h1>
    <p className="text-xl text-[var(--color-text-secondary)] mt-4 max-w-lg font-light leading-relaxed">
      Describe your vision. The agent swarm will handle the rest.
    </p>
  </div>
);

const GeneratedMediaItem: React.FC<{ campaign: GeneratedCampaign; onClick: () => void; onDelete: (id: string | number) => void }> = ({ campaign, onClick, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative break-inside-avoid mb-6 rounded-2xl overflow-hidden cursor-pointer group border border-transparent hover:border-[var(--color-border-primary)] transition-all bg-[var(--color-background-secondary)] shadow-lg hover:shadow-2xl"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Content */}
      <div className="w-full relative bg-black/50 aspect-[16/9] md:aspect-auto">
          {campaign.format === 'image' ? (
            <img
              src={campaign.mediaUrl}
              alt={campaign.title}
              className="w-full h-auto object-cover block"
              loading="lazy"
            />
          ) : campaign.format === 'video' ? (
             <video
              src={campaign.mediaUrl}
              className="w-full h-auto object-cover block"
              autoPlay={isHovered}
              loop
              muted
              playsInline
              poster={campaign.mediaUrl + '#t=0.1'} 
            />
          ) : (
            <div className="w-full aspect-video flex flex-col items-center justify-center p-8 bg-[var(--color-background-tertiary)] relative overflow-hidden">
               <div className="absolute inset-0 bg-[var(--color-primary)] opacity-5"></div>
               <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] z-10">
                 <Icon path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" className="w-6 h-6 text-white ml-1" />
               </div>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
             <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{campaign.title}</h3>
             <p className="text-zinc-300 text-xs mt-1 line-clamp-2">{campaign.description}</p>
             
             <div className="flex items-center justify-between mt-3">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-accent)] bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                    {campaign.format}
                 </span>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(campaign.id); }}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/80 hover:text-white transition-colors text-white/70"
                 >
                     <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-4 h-4" />
                 </button>
             </div>
          </div>
          
          {/* Status Indicator (if processing) */}
          {campaign.mediaUrl === '' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                   <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
          )}
      </div>
    </div>
  );
};


export const ControlPlane: React.FC<ControlPlaneProps> = ({ campaigns, uiComponents, onSelectConcept, onDeleteCampaign }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<GeneratedCampaign | null>(null);
  const [lastSavedMemory, setLastSavedMemory] = useState<string | null>(null);

  const handleAction = (action: string, data: any) => {
      console.log('[ControlPlane] Action Triggered:', action, data);
      
      if (action === 'SELECT_CONCEPT') {
          onSelectConcept(data);
      } else if (action === 'SAVE_MEMORY') {
          setLastSavedMemory(data.pattern_to_save?.style || 'Style Preference');
          // Clear badge after some time or let component handle it
      } else if (action === 'JOB_COMPLETE') {
           // If we have a URL from the stream job complete, open it in the modal
           if (data.url) {
               // Try to find the campaign in our list first
               const existingCampaign = campaigns.find(c => c.jobId === data.jobId);
               if (existingCampaign) {
                   setSelectedCampaign(existingCampaign);
               } else {
                   // Fallback for stream-only jobs (like the initial workflow result)
                   setSelectedCampaign({
                       id: data.jobId || 'temp_result',
                       title: 'Workflow Result',
                       description: 'Generated output from agent workflow',
                       style: 'Auto',
                       image_prompt: '',
                       mediaUrl: data.url,
                       format: 'video', 
                       observability: { complianceScore: 10, toolFailoverUsed: false, memoryStatus: 'not_triggered', retries: 0 },
                       status: 'complete'
                   });
               }
           }
      }
  };

  const handleCloseModal = () => setSelectedCampaign(null);

  return (
    <>
      <div className="w-full h-full relative"> 
        {/* Memory Badge Notification (Toast) */}
        {lastSavedMemory && <MemoryBadge key={lastSavedMemory} label={`Pattern Saved: ${lastSavedMemory}`} />}

        {/* 1. Welcome State */}
        {campaigns.length === 0 && uiComponents.length === 0 && (
            <WelcomeMessage />
        )}

        {/* 2. Agent Interface Stream (Chat) */}
        <div className="w-full max-w-5xl mx-auto space-y-8 mb-16">
            {uiComponents.map((component, index) => (
                <A2UIRenderer 
                    key={index} 
                    payload={component} 
                    onAction={handleAction} 
                />
            ))}
        </div>

        {/* 3. Generated Campaigns Grid (Masonry) */}
        {campaigns.length > 0 && (
            <div className="animate-fade-in w-full border-t border-[var(--color-border-primary)] pt-12 mt-12 mb-32">
               <div className="flex items-center gap-4 mb-8">
                   <h2 className="text-2xl font-heading font-bold text-[var(--color-text-primary)]">Asset Library</h2>
                   <div className="px-3 py-1 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] text-xs font-mono text-[var(--color-text-secondary)]">
                       {campaigns.length} Generated
                   </div>
               </div>
               
               <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {campaigns.map((campaign) => (
                        <GeneratedMediaItem 
                            key={campaign.id} 
                            campaign={campaign} 
                            onClick={() => setSelectedCampaign(campaign)} 
                            onDelete={onDeleteCampaign}
                        />
                    ))}
               </div>
            </div>
        )}
      </div>
      <MediaModal 
        campaign={selectedCampaign} 
        onClose={handleCloseModal} 
      />
    </>
  );
};
