
import React from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { ControlPlane } from './components/ControlPlane';
import { type AiResponse, AiResponseType, type UiComponent } from './types';
import { LoadingExperience } from './components/LoadingExperience';
import { GoldenDatasetTester } from './components/GoldenDatasetTester';
import { AgentOpsDashboard } from './components/AgentOpsDashboard';
import { MemoryConfirmationModal } from './components/MemoryConfirmationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AppBackground } from './components/AppBackground';
import { SessionSidebar } from './components/SessionSidebar';
import { AgentSwarmList } from './components/AgentSwarmList';
import { ContentReel } from './components/ContentReel';
import { useAppUI } from './hooks/useAppUI';
import { useSession } from './hooks/useSession';
import { useAgent } from './hooks/useAgent';

export type AppView = 'creator' | 'browse' | 'tester' | 'ops';

export const App: React.FC = () => {
  const { 
    view, 
    isProfileModalOpen, 
    isSettingsModalOpen, 
    handleSetView, 
    handleOpenProfile, 
    handleOpenSettings, 
    handleCloseAllModals 
  } = useAppUI();

  const {
    sessions,
    activeSessionId,
    sessionHistory,
    showMemoryModal,
    memoryPattern,
    handleNewSession,
    handleOpenSession,
    handleDeleteSession,
    handleConfirmSaveMemory,
    handleDeclineSaveMemory,
    handleResetSession,
  } = useSession();

  const {
    isLoading,
    loadingMessage,
    aiResponse,
    uiComponents,
    generatedCampaigns,
    handleGenerateConcepts,
    executeGeneration,
    handleDeleteCampaign,
  } = useAgent(sessionHistory, handleResetSession);

  const handleConceptSelect = (concept: any) => {
    executeGeneration(concept, 'preference_logged');
  };
  
  const renderView = () => {
    switch(view) {
      case 'browse':
        return <ContentReel campaigns={generatedCampaigns} />;
      case 'tester':
        return <GoldenDatasetTester />;
      case 'ops':
        return <AgentOpsDashboard uiComponents={uiComponents} />;
      case 'creator':
      default:
        return (
          <>
            {isLoading && uiComponents.length === 0 && generatedCampaigns.length === 0 ? (
              <LoadingExperience message={loadingMessage} />
            ) : (
              <ControlPlane 
                campaigns={generatedCampaigns} 
                uiComponents={uiComponents}
                onSelectConcept={handleConceptSelect}
                onDeleteCampaign={handleDeleteCampaign}
                format={undefined} 
              />
            )}
          </>
        );
    }
  }

  return (
    <>
      <AppBackground view={view} showcaseStyle={'fluid'} />
      
      <div className="flex h-screen w-full overflow-hidden relative z-10 text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
        
        {/* Left Sidebar: Context & Memory */}
        {view === 'creator' && (
          <aside className="w-64 h-full flex-shrink-0 border-r border-[var(--color-border-primary)] bg-[var(--color-background-glass)] backdrop-blur-xl hidden md:block z-20">
            <div className="p-6">
                <Header 
                  currentView={view} 
                  onSetView={handleSetView}
                  onOpenProfile={handleOpenProfile}
                  onOpenSettings={handleOpenSettings}
                  minimal
                />
            </div>
            <div className="px-4 h-[calc(100%-100px)]">
               <SessionSidebar 
                sessions={sessions}
                activeSessionId={activeSessionId}
                onNewSession={handleNewSession} 
                onOpenSession={handleOpenSession}
                onDeleteSession={handleDeleteSession}
              />
            </div>
          </aside>
        )}

        {/* Center: Main Cockpit Canvas */}
        <div className="flex-1 flex flex-col relative h-full overflow-hidden">
           {view !== 'creator' && (
               <div className="w-full border-b border-[var(--color-border-primary)] bg-[var(--color-background-glass)] backdrop-blur-md px-6 py-4 z-20">
                  <Header 
                    currentView={view} 
                    onSetView={handleSetView}
                    onOpenProfile={handleOpenProfile}
                    onOpenSettings={handleOpenSettings}
                  />
               </div>
           )}

           <main className="flex-1 overflow-y-auto relative scroll-smooth p-6 pb-32">
             <div className="max-w-[1600px] mx-auto w-full">
                {aiResponse && (
                  <div 
                    className={`mb-6 p-4 rounded-xl border backdrop-blur-md shadow-lg animate-fade-in flex items-start gap-3 ${
                      aiResponse.type === AiResponseType.ERROR 
                      ? 'bg-red-500/10 border-red-500/30 text-red-200' 
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                    }`} 
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full ${aiResponse.type === AiResponseType.ERROR ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <div>
                        <strong className="block font-heading uppercase text-xs tracking-wider opacity-70 mb-1">
                        {aiResponse.type === AiResponseType.ERROR ? 'System Error' : 
                        aiResponse.type === AiResponseType.REFUSAL ? 'Safety Policy' :
                        'Input Required'}
                        </strong>
                        {aiResponse.message}
                    </div>
                  </div>
                )}
                
                {renderView()}
             </div>
           </main>
           
           {/* Floating Prompt Bar Container */}
           {view === 'creator' && (
             <div className="absolute bottom-0 left-0 w-full p-6 flex justify-center pointer-events-none z-50 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/80 to-transparent">
                <div className="pointer-events-auto w-full max-w-4xl">
                  <PromptBar onGenerate={handleGenerateConcepts} isLoading={isLoading} />
                </div>
             </div>
           )}
        </div>

        {/* Right Sidebar: Agent Swarm Visibility */}
        {view === 'creator' && (
          <aside className="w-72 h-full flex-shrink-0 border-l border-[var(--color-border-primary)] bg-[var(--color-background-glass)] backdrop-blur-xl hidden lg:block z-20 p-6">
             <AgentSwarmList />
          </aside>
        )}

      </div>
      
      {showMemoryModal && memoryPattern && (
        <MemoryConfirmationModal
          pattern={memoryPattern}
          onConfirm={() => handleConfirmSaveMemory(() => executeGeneration(sessionHistory[sessionHistory.length - 1], 'confirmation_triggered'))}
          onDecline={() => handleDeclineSaveMemory(() => executeGeneration(sessionHistory[sessionHistory.length - 1], 'confirmation_triggered'))}
        />
      )}
      {isProfileModalOpen && (
        <UserProfileModal
            sessionHistory={sessionHistory}
            onClose={handleCloseAllModals}
        />
      )}
      {isSettingsModalOpen && (
        <SettingsModal
            onSetView={handleSetView}
            onClose={handleCloseAllModals}
        />
      )}
    </>
  );
};
