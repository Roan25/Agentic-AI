import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { ControlPlane } from './components/ControlPlane';
import { generateCreativeConcepts, generateFinalAsset } from './services/geminiService';
import { type GeneratedCampaign, type AspectRatio, type Format, type ImageQuality, type VideoQuality, type CreativeConcept, type AiResponse, AiResponseType, type VoiceStyle, type Language, ObservabilityMetrics, UiComponent, UiComponentType, type TargetDuration } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';
import { LoadingExperience } from './components/LoadingExperience';
import { GoldenDatasetTester } from './components/GoldenDatasetTester';
import { AgentOpsDashboard } from './components/AgentOpsDashboard';
import { MemoryConfirmationModal } from './components/MemoryConfirmationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AppBackground } from './components/CreativeShowcase';
import { useTheme } from './contexts/ThemeContext';
import { SessionSidebar } from './components/SessionSidebar';
import { ContentReel } from './components/ContentReel';
import { MOCK_SESSIONS } from './constants';

export type AppView = 'creator' | 'browse' | 'tester' | 'ops';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  
  const [uiComponents, setUiComponents] = useState<UiComponent[]>([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<GeneratedCampaign[]>([]);
  
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [view, setView] = useState<AppView>('creator');
  
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState(MOCK_SESSIONS[0]?.id || null);


  // Memory Protocol State
  const [sessionHistory, setSessionHistory] = useState<CreativeConcept[]>([]);
  const [showMemoryModal, setShowMemoryModal] = useState<boolean>(false);
  const [memoryPattern, setMemoryPattern] = useState<{ style: string } | null>(null);
  const [pendingConcept, setPendingConcept] = useState<CreativeConcept | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const { showcaseStyle } = useTheme();


  // Store generation settings to use them in the second stage
  const [generationSettings, setGenerationSettings] = useState<{
    aspectRatio: AspectRatio;
    format: Format;
    imageQuality: ImageQuality;
    videoQuality: VideoQuality;
    voiceStyle: VoiceStyle;
    language: Language;
    targetDuration: TargetDuration;
    uploadedImage?: { data: string, mimeType: string };
  } | null>(null);
  
  useEffect(() => {
    window.aistudio?.hasSelectedApiKey().then(setHasApiKey);
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };
  
  const handleError = (error: unknown) => {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("[UNRECOVERABLE]")) {
        setAiResponse({ type: AiResponseType.ERROR, message: `The agent failed to generate the asset after multiple recovery attempts. Please try a different prompt or adjust your settings. Final error: ${errorMessage}` });
    } else if (errorMessage.includes("entity was not found")) {
      setAiResponse({ type: AiResponseType.ERROR, message: "Your API key is invalid. Please select a valid key from a paid project to continue." });
      setHasApiKey(false);
    } else {
      setAiResponse({ type: AiResponseType.ERROR, message: `An unexpected error occurred: ${errorMessage}. Please check the console and try again.` });
    }
  };

  const handleGenerateConcepts = useCallback(async (
    prompt: string, 
    aspectRatio: AspectRatio, 
    format: Format,
    imageQuality: ImageQuality,
    videoQuality: VideoQuality,
    voiceStyle: VoiceStyle,
    language: Language,
    targetDuration: TargetDuration,
    uploadedImage?: { data: string, mimeType: string }
  ) => {
    if (!prompt.trim() && !uploadedImage || !hasApiKey) return;
    
    try {
      setIsLoading(true);
      setAiResponse(null);
      setGeneratedCampaigns([]);
      setUiComponents([]);
      
      const settings = { aspectRatio, format, imageQuality, videoQuality, voiceStyle, language, targetDuration, uploadedImage };
      setGenerationSettings(settings);

      setLoadingMessage('Initializing agent...');
      const result = await generateCreativeConcepts(prompt, sessionHistory, settings, (msg) => setLoadingMessage(msg), uploadedImage);

      if ('uiComponents' in result) {
        setUiComponents(result.uiComponents);
      } else {
        setAiResponse({
          type: result.aiResponseType === 'refusal' ? AiResponseType.REFUSAL : AiResponseType.CLARIFICATION,
          message: result.message
        });
      }
      
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [hasApiKey, sessionHistory]);

  const executeGeneration = useCallback(async (concept: CreativeConcept, memoryStatus: ObservabilityMetrics['memoryStatus']) => {
    if (!generationSettings) {
      setAiResponse({ type: AiResponseType.ERROR, message: "Generation settings are missing. Please start a new project."});
      return;
    }
    
    try {
      setIsLoading(true);
      setAiResponse(null);
      setUiComponents([]); // Clear concepts to show loading for the final asset

      const { format, aspectRatio, imageQuality, videoQuality, voiceStyle, language, uploadedImage } = generationSettings;
      
      const result = await generateFinalAsset(
        concept,
        format,
        aspectRatio,
        imageQuality,
        videoQuality,
        voiceStyle,
        language,
        memoryStatus,
        setLoadingMessage,
        uploadedImage
      );
      
      if ('aiResponseType' in result) {
        setAiResponse({
          type: AiResponseType.REFUSAL,
          message: result.message
        });
      } else {
        setGeneratedCampaigns([result]);
      }

    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [generationSettings]);

  const handleConceptSelect = useCallback(async (concept: CreativeConcept) => {
    const updatedHistory = [...sessionHistory, concept];
    setSessionHistory(updatedHistory);

    const styleCounts = updatedHistory.reduce((acc, c) => {
        acc[c.style] = (acc[c.style] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const newPatternStyle = Object.keys(styleCounts).find(style => styleCounts[style] === 3);

    if (newPatternStyle) {
        setMemoryPattern({ style: newPatternStyle });
        setPendingConcept(concept);
        setShowMemoryModal(true);
        return; // Pause execution until user responds
    }

    await executeGeneration(concept, 'preference_logged');
  }, [sessionHistory, executeGeneration]);
  
  const handleConfirmSaveMemory = async () => {
    if (memoryPattern && pendingConcept) {
        console.log("SIMULATING: Saving pattern to permanent profile:", memoryPattern);
        // In a real app, you would call a service here:
        // await confirmAndSaveProfile({ pattern_type: 'style', pattern_value: memoryPattern.style });
    }
    setShowMemoryModal(false);
    if (pendingConcept) {
        await executeGeneration(pendingConcept, 'confirmation_triggered');
    }
    setMemoryPattern(null);
    setPendingConcept(null);
  };

  const handleDeclineSaveMemory = async () => {
      setShowMemoryModal(false);
      if (pendingConcept) {
          await executeGeneration(pendingConcept, 'confirmation_triggered');
      }
      setMemoryPattern(null);
      setPendingConcept(null);
  };


  const handleReset = () => {
    setIsLoading(false);
    setAiResponse(null);
    setGeneratedCampaigns([]);
    setUiComponents([]);
    setGenerationSettings(null);
    setSessionHistory([]);
    const newSessionId = `session_${Date.now()}`;
    setSessions(prev => [{ id: newSessionId, title: 'New Session', date: 'Today'}, ...prev]);
    setActiveSessionId(newSessionId);
    setView('creator');
  };
  
  const handleOpenSession = (sessionId: string) => {
      setActiveSessionId(sessionId);
      // In a real app, you would fetch the data for this session
      // For now, we just reset the view
      setIsLoading(false);
      setAiResponse(null);
      setGeneratedCampaigns([]);
      setUiComponents([]);
      setGenerationSettings(null);
      setSessionHistory([]);
  };

  const handleDeleteSession = (sessionId: string) => {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
          // If the active session is deleted, activate the next one or reset
          const newActiveId = sessions.length > 1 ? sessions.find(s => s.id !== sessionId)?.id : null;
          setActiveSessionId(newActiveId);
          handleReset();
      }
  };
  
  const handleDeleteCampaign = (campaignId: string | number) => {
      setGeneratedCampaigns(prev => prev.filter(c => c.id !== campaignId));
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
                format={generationSettings?.format}
              />
            )}
          </>
        );
    }
  }

  if (!hasApiKey) {
    return <ApiKeySelector onSelectKey={handleSelectKey} />;
  }

  return (
    <>
      <AppBackground view={view} showcaseStyle={showcaseStyle} />
      <div className="min-h-screen bg-transparent text-[var(--color-text-primary)] flex flex-col p-4 sm:p-6 lg:p-8 relative z-10">
        <Header 
          currentView={view} 
          onSetView={setView}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        <div className={`w-full max-w-7xl mx-auto flex-grow flex flex-row mt-4 gap-6 ${view !== 'creator' ? 'justify-center' : ''}`}>
          {view === 'creator' && (
            <SessionSidebar 
              sessions={sessions}
              activeSessionId={activeSessionId}
              onNewSession={handleReset} 
              onOpenSession={handleOpenSession}
              onDeleteSession={handleDeleteSession}
            />
          )}
          
          <main className="flex-1 flex flex-col min-w-0">
            {aiResponse && (
              <div 
                className={`border text-white px-4 py-3 rounded-lg relative mb-4 ${
                  aiResponse.type === AiResponseType.ERROR ? 'bg-red-800/50 border-red-600' : 'bg-sky-800/50 border-sky-600'
                }`} 
                role="alert"
              >
                <strong>
                  {aiResponse.type === AiResponseType.ERROR ? 'Error' : 
                  aiResponse.type === AiResponseType.REFUSAL ? 'Request Refused' :
                  'Clarification Needed'}
                  :
                </strong> {aiResponse.message}
              </div>
            )}
            
            {renderView()}

            {view === 'creator' && <PromptBar onGenerate={handleGenerateConcepts} isLoading={isLoading} />}
          </main>
        </div>
        
        {showMemoryModal && memoryPattern && (
          <MemoryConfirmationModal
            pattern={memoryPattern}
            onConfirm={handleConfirmSaveMemory}
            onDecline={handleDeclineSaveMemory}
          />
        )}
        {isProfileModalOpen && (
          <UserProfileModal
              sessionHistory={sessionHistory}
              onClose={() => setIsProfileModalOpen(false)}
          />
        )}
        {isSettingsModalOpen && (
          <SettingsModal
              onSetView={setView}
              onClose={() => setIsSettingsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default App;
