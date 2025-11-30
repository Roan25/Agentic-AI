
import { useState, useCallback } from 'react';
import { AgentApiService } from '../services/AgentApiService';
import { generateFinalAsset, pollForJobCompletion } from '../services/geminiService'; // Keep for legacy/utility
import { 
    type GeneratedCampaign, 
    type AspectRatio, 
    type Format, 
    type ImageQuality, 
    type VideoQuality, 
    type CreativeConcept, 
    type AiResponse, 
    AiResponseType, 
    type VoiceStyle, 
    type Language, 
    ObservabilityMetrics, 
    UiComponent, 
    TargetDuration,
    A2UIPayload
} from '../types';
import { useAgentContext } from '../contexts/AgentContext';

export const useAgent = (sessionHistory: CreativeConcept[], handleResetSession: () => void) => {
    const { state, addMessage, upsertComponent, clearHistory } = useAgentContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
    const [generatedCampaigns, setGeneratedCampaigns] = useState<GeneratedCampaign[]>([]);
    
    // We store the current generation settings to reuse them when the user selects a concept
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

    const handleError = useCallback((error: unknown) => {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setAiResponse({ type: AiResponseType.ERROR, message: `An unexpected error occurred: ${errorMessage}` });
    }, []);
    
    const pollAndFinalizeCampaign = useCallback(async (processingCampaign: GeneratedCampaign) => {
        if (!processingCampaign.jobId) return;

        try {
            const finalCampaign = await pollForJobCompletion(processingCampaign.jobId);
            setGeneratedCampaigns(prev => 
                prev.map(c => c.id === processingCampaign.id ? { ...finalCampaign, id: c.id } : c)
            );
        } catch (e) {
            handleError(e);
            setGeneratedCampaigns(prev =>
                prev.map(c => c.id === processingCampaign.id ? { ...c, status: 'FAILED' } : c)
            );
        }
    }, [handleError]);


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
        if (!prompt.trim() && !uploadedImage) return;

        try {
            setIsLoading(true);
            setAiResponse(null);
            setGeneratedCampaigns([]);
            clearHistory(); // Clear previous chat for a new "Run"
            
            const settings = { aspectRatio, format, imageQuality, videoQuality, voiceStyle, language, targetDuration, uploadedImage };
            setGenerationSettings(settings);

            setLoadingMessage('Initializing agent workflow...');
            
            // Execute the Agent Workflow via the Model Router with STREAMING
            await AgentApiService.executeAgentWorkflow({
                prompt,
                session_history: sessionHistory,
                settings,
                uploadedImage
            }, (payload: A2UIPayload) => {
                // Handle SSE Stream Updates
                if (payload.component_type === 'SelectionCard' || payload.component_type === 'AsyncStatusBar') {
                    // Update the existing component in place (Skeleton -> Data)
                    upsertComponent(payload);
                } else {
                    // Standard message (Text, SystemAlert) - append it
                    addMessage(payload);
                }
            });

        } catch (e) {
            handleError(e);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [sessionHistory, handleError, clearHistory, addMessage, upsertComponent]);

    const executeGeneration = useCallback(async (concept: CreativeConcept, memoryStatus: ObservabilityMetrics['memoryStatus']) => {
        // Fallback defaults to ensure generation works even if state is missing (e.g. reload)
        const settings = generationSettings || {
            aspectRatio: "16:9",
            format: "video",
            imageQuality: "1080p",
            videoQuality: "1080p",
            voiceStyle: "professional",
            language: "en-US",
            targetDuration: "medium"
        };

        try {
            setIsLoading(true);
            setAiResponse(null);
            // We don't clear history here as we want to keep the conversation going

            const { format, aspectRatio, imageQuality, videoQuality, voiceStyle, language, uploadedImage } = settings;
            
            const result = await generateFinalAsset(
                concept,
                format,
                aspectRatio,
                imageQuality,
                videoQuality,
                voiceStyle,
                language,
                memoryStatus,
                uploadedImage
            );
            
            if ('aiResponseType' in result) {
                setAiResponse({
                    type: AiResponseType.REFUSAL,
                    message: result.message
                });
            } else {
                setGeneratedCampaigns(prev => [result, ...prev]);
                if (result.status === 'processing' && result.jobId) {
                    pollAndFinalizeCampaign(result);
                }
            }
        } catch (e) {
            handleError(e);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [generationSettings, handleError, pollAndFinalizeCampaign]);
    
    const handleDeleteCampaign = useCallback((campaignId: string | number) => {
      setGeneratedCampaigns(prev => prev.filter(c => c.id !== campaignId));
    }, []);

    return {
        isLoading,
        loadingMessage,
        aiResponse,
        uiComponents: state.history, // Expose history from Context as uiComponents
        generatedCampaigns,
        handleGenerateConcepts,
        executeGeneration,
        handleDeleteCampaign,
    };
};
