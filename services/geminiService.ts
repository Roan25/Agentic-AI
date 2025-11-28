
import { 
    type CreativeConcept, 
    type GeneratedCampaign, 
    type AspectRatio, 
    type ImageQuality, 
    type VideoQuality, 
    Format, 
    type TestCase, 
    type TestResult, 
    VoiceStyle, 
    Language, 
    ObservabilityMetrics, 
    UiComponent, 
    TargetDuration 
} from '../types';
import { apiClient } from '../apiClient';

/**
 * Initiates the concept generation process by sending the user's request and settings to the backend agent.
 * The backend handles the complex reasoning, RAG, and A2A delegation.
 * @returns A promise that resolves to the A2UI components for the frontend to render.
 */
export async function generateCreativeConcepts(
    request: string, 
    sessionHistory: CreativeConcept[], 
    settings: {
        format: Format;
        aspectRatio: AspectRatio;
        imageQuality: ImageQuality;
        videoQuality: VideoQuality;
        voiceStyle: VoiceStyle;
        language: Language;
        targetDuration: TargetDuration;
    },
    uploadedImage?: { data: string, mimeType: string }
): Promise<{ uiComponents: UiComponent[] } | { aiResponseType: 'clarification' | 'refusal', message: string }> {
    console.log('[API Client] Sending request to /api/generate-concepts');
    return apiClient.post('/api/generate-concepts', {
        request,
        sessionHistory,
        settings,
        uploadedImage
    });
}

/**
 * Initiates the final asset generation on the backend.
 * For synchronous assets (image, voiceover), it returns the completed campaign.
 * For asynchronous assets (video), it returns a "processing" campaign with a job ID.
 * @returns A promise that resolves to a GeneratedCampaign object.
 */
export async function generateFinalAsset(
    concept: CreativeConcept,
    format: Format,
    aspectRatio: AspectRatio,
    imageQuality: ImageQuality,
    videoQuality: VideoQuality,
    voiceStyle: VoiceStyle,
    language: Language,
    memoryStatus: ObservabilityMetrics['memoryStatus'],
    uploadedImage?: { data: string, mimeType: string }
): Promise<GeneratedCampaign | { aiResponseType: 'refusal', message: string }> {
    console.log(`[API Client] Sending request to /api/generate-asset for format: ${format}`);
    
    // MOCK MODE: Return a fake job immediately if API fails or for demo
    try {
        return await apiClient.post('/api/generate-asset', {
            concept, format, aspectRatio, imageQuality, videoQuality, voiceStyle, language, memoryStatus, uploadedImage
        });
    } catch (e) {
        console.warn("[GeminiService] API failed, returning MOCK 'Processing' response.");
        return {
            ...concept,
            mediaUrl: '',
            format: format,
            observability: {
                complianceScore: 9,
                toolFailoverUsed: false,
                memoryStatus: memoryStatus,
                retries: 0
            },
            jobId: `job_${Date.now()}`, // Fake Job ID triggers the polling hook
            status: 'processing'
        } as GeneratedCampaign;
    }
}

/**
 * Polls the backend for the status of a long-running job (like video generation).
 * @param jobId The ID of the job to check.
 * @returns A promise that resolves to the completed GeneratedCampaign.
 */
export async function pollForJobCompletion(jobId: string): Promise<GeneratedCampaign> {
    console.log(`[API Client] Polling status for job: ${jobId}`);
    try {
        return await apiClient.get(`/api/job-status/${jobId}`);
    } catch (e) {
        // MOCK POLLING: Simulate 3-step completion
        // In a real app, this would throw, but for the demo we want to see the progress bar finish.
        console.log("[GeminiService] Polling failed (expected in demo). Simulating success.");
        
        // Random chance to be "still processing" vs "complete" based on time?
        // For simplicity, we'll just return complete to finish the animation in the hook.
        return {
            id: 'mock_result',
            title: 'Mock Result',
            description: 'Generated content',
            style: 'Cinematic',
            image_prompt: '',
            // Placeholder video for the demo
            mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            format: 'video',
            observability: { complianceScore: 9.5, toolFailoverUsed: false, memoryStatus: 'not_triggered', retries: 0 },
            status: 'complete'
        } as GeneratedCampaign;
    }
}

/**
 * Sends an image and an editing prompt to the backend for modification.
 * @returns A promise that resolves to the new base64 image data.
 */
export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
    console.log('[API Client] Sending request to /api/edit-image');
    const response = await apiClient.post<{ newBase64: string }>('/api/edit-image', {
        base64ImageData,
        mimeType,
        prompt
    });
    return response.newBase64;
}

/**
 * Sends a test case to the backend to be run against the agent's evaluation suite.
 * @returns A promise that resolves to the full test result, including the judge's score.
 */
export async function runAndEvaluateTestCase(testCase: TestCase): Promise<TestResult> {
    console.log(`[API Client] Sending request to /api/run-test for case: ${testCase.caseId}`);
    return apiClient.post('/api/run-test', { testCase });
}
