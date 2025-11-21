import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptBar } from './components/PromptBar';
import { MediaCanvas } from './components/ImageCanvas';
import { generateCreativeConcepts, generateFinalAsset } from './services/geminiService';
import { type GeneratedCampaign, type AspectRatio, type Format, type ImageQuality, type VideoQuality, type CreativeConcept, type AiResponse, AiResponseType } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';
import { LoadingExperience } from './components/LoadingExperience';
import { GoldenDatasetTester } from './components/GoldenDatasetTester';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  
  const [concepts, setConcepts] = useState<CreativeConcept[]>([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<GeneratedCampaign[]>([]);
  
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [view, setView] = useState<'creator' | 'tester'>('creator');

  // Store generation settings to use them in the second stage
  const [generationSettings, setGenerationSettings] = useState<{
    aspectRatio: AspectRatio;
    format: Format;
    imageQuality: ImageQuality;
    videoQuality: VideoQuality;
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
    if (errorMessage.includes("entity was not found")) {
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
  ) => {
    if (!prompt.trim() || !hasApiKey) return;
    
    try {
      setIsLoading(true);
      setAiResponse(null);
      setGeneratedCampaigns([]);
      setConcepts([]);
      setGenerationSettings({ aspectRatio, format, imageQuality, videoQuality });

      setLoadingMessage('Generating creative concepts...');
      const result = await generateCreativeConcepts(prompt, (msg) => setLoadingMessage(msg));

      if ('aiResponseType' in result) {
        setAiResponse({
          type: result.aiResponseType === 'refusal' ? AiResponseType.REFUSAL : AiResponseType.CLARIFICATION,
          message: result.message
        });
      } else {
        setConcepts(result);
      }
      
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [hasApiKey]);

  const handleConceptSelect = useCallback(async (concept: CreativeConcept) => {
    if (!generationSettings) {
      setAiResponse({ type: AiResponseType.ERROR, message: "Generation settings are missing. Please start a new project."});
      return;
    }
    
    try {
      setIsLoading(true);
      setAiResponse(null);
      setConcepts([]); // Clear concepts to show loading for the final asset

      const { format, aspectRatio, imageQuality, videoQuality } = generationSettings;
      
      const result = await generateFinalAsset(
        concept,
        format,
        aspectRatio,
        imageQuality,
        videoQuality,
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

  const handleReset = () => {
    setIsLoading(false);
    setAiResponse(null);
    setGeneratedCampaigns([]);
    setConcepts([]);
    setGenerationSettings(null);
    setView('creator');
  };

  if (!hasApiKey) {
    return <ApiKeySelector onSelectKey={handleSelectKey} />;
  }

  const hasContent = generatedCampaigns.length > 0 || concepts.length > 0;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col p-4 sm:p-6 lg:p-8">
      <Header onReset={handleReset} hasContent={hasContent} currentView={view} onSetView={setView} />
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
        
        {view === 'creator' && (
          <>
            {isLoading && concepts.length === 0 ? (
              <LoadingExperience message={loadingMessage} />
            ) : (
              <MediaCanvas 
                campaigns={generatedCampaigns} 
                concepts={concepts}
                onSelectConcept={handleConceptSelect}
              />
            )}
          </>
        )}
        
        {view === 'tester' && (
          <GoldenDatasetTester />
        )}

      </main>
      {view === 'creator' && <PromptBar onGenerate={handleGenerateConcepts} isLoading={isLoading} />}
    </div>
  );
};

export default App;
