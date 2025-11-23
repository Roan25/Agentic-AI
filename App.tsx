import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { ControlPlane } from './components/ControlPlane';
import { generateCreativeConcepts, generateFinalAsset } from './services/geminiService';
import { type GeneratedCampaign, type AspectRatio, type Format, type ImageQuality, type VideoQuality, type CreativeConcept, type AiResponse, AiResponseType, type VoiceStyle, type Language, ObservabilityMetrics, UiComponent, UiComponentType } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';
import { LoadingExperience } from './components/LoadingExperience';
import { GoldenDatasetTester } from './components/GoldenDatasetTester';
import { AgentOpsDashboard } from './components/AgentOpsDashboard';
import { MemoryConfirmationModal } from './components/MemoryConfirmationModal';
import { UserProfileModal } from './components/UserProfileModal';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  
  const [uiComponents, setUiComponents] = useState<UiComponent[]>([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<GeneratedCampaign[]>([]);
  
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [view, setView] = useState<'creator' | 'tester' | 'ops'>('creator');

  // Memory Protocol State
  const [sessionHistory, setSessionHistory] = useState<CreativeConcept[]>([]);
  const [showMemoryModal, setShowMemoryModal] = useState<boolean>(false);
  const [memoryPattern, setMemoryPattern] = useState<{ style: string } | null>(null);
  const [pendingConcept, setPendingConcept] = useState<CreativeConcept | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);


  // Store generation settings to use them in the second stage
  const [generationSettings, setGenerationSettings] = useState<{
    aspectRatio: AspectRatio;
    format: Format;
    imageQuality: ImageQuality;
    videoQuality: VideoQuality;
    voiceStyle: VoiceStyle;
    language: Language;
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
  ) => {
    if (!prompt.trim() || !hasApiKey) return;
    
    try {
      setIsLoading(true);
      setAiResponse(null);
      setGeneratedCampaigns([]);
      setUiComponents([]);
      setGenerationSettings({ aspectRatio, format, imageQuality, videoQuality, voiceStyle, language });

      setLoadingMessage('Initializing agent...');
      const result = await generateCreativeConcepts(prompt, sessionHistory, (msg) => setLoadingMessage(msg));

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

      const { format, aspectRatio, imageQuality, videoQuality, voiceStyle, language } = generationSettings;
      
      const result = await generateFinalAsset(
        concept,
        format,
        aspectRatio,
        imageQuality,
        videoQuality,
        voiceStyle,
        language,
        memoryStatus,
        setLoadingMessage
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
    setView('creator');
  };

  const renderView = () => {
    switch(view) {
      case 'tester':
        return <GoldenDatasetTester />;
      case 'ops':
        return <AgentOpsDashboard />;
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
              />
            )}
          </>
        );
    }
  }

  if (!hasApiKey) {
    return <ApiKeySelector onSelectKey={handleSelectKey} />;
  }

  const hasContent = generatedCampaigns.length > 0 || uiComponents.length > 0;

  return (
    <div className="min-h-screen bg-transparent text-[var(--color-text-primary)] flex flex-col p-4 sm:p-6 lg:p-8">
      <Header 
        onReset={handleReset} 
        hasContent={hasContent} 
        currentView={view} 
        onSetView={setView} 
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col mt-4">
        {aiResponse && (
          <div 
            className={`border text-white px-4 py-3 rounded-lg relative my-4 max-w-3xl mx-auto ${
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

      </main>
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
      {view === 'creator' && <PromptBar onGenerate={handleGenerateConcepts} isLoading={isLoading} />}
    </div>
  );
};

export default App;