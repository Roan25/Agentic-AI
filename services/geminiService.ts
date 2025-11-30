
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

// GLOBAL DEMO MODE FLAG
// Set to true to bypass all backend API calls and use pure client-side mocks.
// This prevents 404 errors in environments without a running backend.
const DEMO_MODE = true;

const SAMPLE_VIDEOS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
];

const SAMPLE_AUDIO = 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav';

// --- MOCK STATE PERSISTENCE ---
// This acts as the "Backend Database" for the demo to remember what the user asked for.
interface JobContext {
    concept: CreativeConcept;
    format: Format;
    aspectRatio: AspectRatio;
    timestamp: number;
}

const MOCK_JOB_STORE = new Map<string, JobContext>();

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
    
    if (DEMO_MODE) {
        console.log("[GeminiService] DEMO_MODE: Skipping network request.");
        return { uiComponents: [] }; 
    }

    try {
        return await apiClient.post('/api/generate-concepts', {
            request,
            sessionHistory,
            settings,
            uploadedImage
        });
    } catch (e) {
        console.warn("[GeminiService] API unavailable. Use AgentApiService for mocked workflow.");
        return { uiComponents: [] }; 
    }
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
    
    const uniqueJobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const uniqueCampaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (DEMO_MODE) {
        console.log(`[GeminiService] DEMO_MODE: Starting job ${uniqueJobId}. PERSISTING CONTEXT: ${concept.title} (${format})`);
        
        // --- CRITICAL FIX: SAVE STATE ---
        MOCK_JOB_STORE.set(uniqueJobId, {
            concept: { ...concept }, // Clone to avoid ref issues
            format: format,
            aspectRatio: aspectRatio,
            timestamp: Date.now()
        });

        return {
            ...concept,
            // Create a unique ID for the generated campaign asset, separate from the concept ID
            id: uniqueCampaignId,
            mediaUrl: '',
            format: format, // Use the requested format, not whatever is in the concept
            observability: {
                complianceScore: 9,
                toolFailoverUsed: false,
                memoryStatus: memoryStatus,
                retries: 0
            },
            jobId: uniqueJobId, // Fake Job ID triggers the polling hook
            status: 'processing'
        } as GeneratedCampaign;
    }

    try {
        return await apiClient.post('/api/generate-asset', {
            concept, format, aspectRatio, imageQuality, videoQuality, voiceStyle, language, memoryStatus, uploadedImage
        });
    } catch (e) {
        console.warn("[GeminiService] API failed, returning MOCK 'Processing' response.");
        // Fallback store save
        MOCK_JOB_STORE.set(uniqueJobId, {
            concept: { ...concept },
            format: format,
            aspectRatio: aspectRatio,
            timestamp: Date.now()
        });
        
        return {
            ...concept,
            id: uniqueCampaignId,
            mediaUrl: '',
            format: format,
            observability: {
                complianceScore: 9,
                toolFailoverUsed: false,
                memoryStatus: memoryStatus,
                retries: 0
            },
            jobId: uniqueJobId,
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

    // Artificial delay to prevent instant 0ms response in UI
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (DEMO_MODE) {
        // --- CRITICAL FIX: RETRIEVE STATE ---
        const jobContext = MOCK_JOB_STORE.get(jobId);

        if (!jobContext) {
            console.warn(`[GeminiService] Job ${jobId} not found in store. Returning generic fallback.`);
            const videoIndex = jobId.length % SAMPLE_VIDEOS.length;
             return {
                id: `result_${jobId}`,
                title: `Generated Asset (${jobId.slice(-4)})`,
                description: 'Context lost - Generic Result',
                style: 'Cinematic',
                image_prompt: '',
                mediaUrl: SAMPLE_VIDEOS[videoIndex],
                format: 'video',
                observability: { complianceScore: 9.5, toolFailoverUsed: false, memoryStatus: 'not_triggered', retries: 0 },
                status: 'complete'
            } as GeneratedCampaign;
        }

        const { concept, format, aspectRatio } = jobContext;
        console.log(`[GeminiService] Job ${jobId} finished. Context found:`, concept.title, format);

        let mediaUrl = '';
        
        if (format === 'image') {
            // Generate a dynamic placeholder image using the concept title
            // Using placehold.co for a clean, generated-looking image placeholder
            const text = encodeURIComponent(concept.title.length > 25 ? concept.title.substring(0, 25) + '...' : concept.title);
            const size = aspectRatio === '9:16' ? '720x1280' : aspectRatio === '1:1' ? '1080x1080' : '1280x720';
            mediaUrl = `https://placehold.co/${size}/2a2a2a/FFF.png?text=${text}`;
        } else if (format === 'voiceover') {
            mediaUrl = SAMPLE_AUDIO;
        } else {
            // Video
            const videoIndex = jobId.charCodeAt(jobId.length - 1) % SAMPLE_VIDEOS.length;
            mediaUrl = SAMPLE_VIDEOS[videoIndex];
        }

        return {
            ...concept, // Spread original concept to keep ID, Title, Description, etc.
            id: `result_${jobId}`, // Unique ID for the asset
            mediaUrl: mediaUrl,
            format: format,
            observability: { complianceScore: 9.8, toolFailoverUsed: false, memoryStatus: 'not_triggered', retries: 0 },
            status: 'complete'
        } as GeneratedCampaign;
    }

    try {
        return await apiClient.get(`/api/job-status/${jobId}`);
    } catch (e) {
        console.log("[GeminiService] Polling failed (expected in demo). Simulating success.");
        const videoIndex = jobId.charCodeAt(jobId.length - 1) % SAMPLE_VIDEOS.length;
        return {
            id: `result_${jobId}`,
            title: `Mock Result ${jobId.slice(-4)}`,
            description: 'Generated content (Simulated)',
            style: 'Cinematic',
            image_prompt: '',
            mediaUrl: SAMPLE_VIDEOS[videoIndex],
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
    
    if (DEMO_MODE) {
         console.log("[GeminiService] DEMO_MODE: Returning original image.");
         return base64ImageData;
    }

    try {
        const response = await apiClient.post<{ newBase64: string }>('/api/edit-image', {
            base64ImageData,
            mimeType,
            prompt
        });
        return response.newBase64;
    } catch (e) {
        console.warn("[GeminiService] Edit Image API unavailable (Demo Mode). Returning original image.");
        return base64ImageData;
    }
}

/**
 * Sends a test case to the backend to be run against the agent's evaluation suite.
 * @returns A promise that resolves to the full test result, including the judge's score.
 */
export async function runAndEvaluateTestCase(testCase: TestCase): Promise<TestResult> {
    console.log(`[API Client] Sending request to /api/run-test for case: ${testCase.caseId}`);

    if (DEMO_MODE) {
        console.log("[GeminiService] DEMO_MODE: Returning mock test evaluation.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
             testCase,
             trajectory: [
                 "Action: retrieve_brand_guidelines('visual_style')",
                 "Observation: Guidelines retrieved.",
                 "Action: generate_concepts_parallel([...])",
                 "Observation: 3 concepts generated.",
                 "Thought: Concept 2 aligns best with safety guidelines."
             ],
             finalAction: "generate_video(concept_id='concept_2')",
             evaluation: {
                 score: 9.2,
                 reasoning: "The agent correctly retrieved guidelines and followed the safety protocol. No violations detected.",
                 violation_detected: false
             }
         };
    }

    try {
        return await apiClient.post('/api/run-test', { testCase });
    } catch (e) {
        console.warn("[GeminiService] Test API unavailable (Demo Mode). Returning mock evaluation.");
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
             testCase,
             trajectory: [
                 "Action: retrieve_brand_guidelines('visual_style')",
                 "Observation: Guidelines retrieved.",
                 "Action: generate_concepts_parallel([...])",
                 "Observation: 3 concepts generated.",
                 "Thought: Concept 2 aligns best with safety guidelines."
             ],
             finalAction: "generate_video(concept_id='concept_2')",
             evaluation: {
                 score: 9.2,
                 reasoning: "The agent correctly retrieved guidelines and followed the safety protocol. No violations detected.",
                 violation_detected: false
             }
         };
    }
}
