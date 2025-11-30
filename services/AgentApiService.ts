
import { A2UIPayload, AgentWorkflowRequest, UiComponentType } from '../types';

const API_ROOT = '/api';

// GLOBAL STATE FOR KILL SWITCH SIMULATION
let GLOBAL_SECURITY_LOCKDOWN = false;

// Helper to generate dynamic mock concepts based on the user's prompt
const generateMockConcepts = (prompt: string) => {
    const subject = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    const cleanSubject = subject.replace(/[^a-zA-Z0-9 ]/g, '');
    
    return [
        {
            id: `concept_${Date.now()}_1`,
            title: `Viral: ${cleanSubject}`,
            style: 'High-Energy',
            description: `A fast-paced, trend-jacking concept focused on '${subject}'. Quick cuts, trending audio, and high engagement hooks.`,
            script: `EXT. LOCATION - DAY. \n\nFast zoom in on subject. \n\nNARRATOR (V.O.)\nYou won't believe this...\n\nMontage of '${subject}' in action. \n\nText overlay: "WAIT FOR IT".`,
            score: 9.2,
            duration_seconds: 15,
            image_prompt: `High energy photo of ${subject}, vibrant colors, motion blur, wide angle, social media aesthetic`
        },
        {
            id: `concept_${Date.now()}_2`,
            title: `Cinematic: ${cleanSubject}`,
            style: 'Premium',
            description: `A moody, high-production value approach to '${subject}'. Slow motion, dramatic lighting, and emotional depth.`,
            script: `INT. STUDIO - NIGHT. \n\nSilhouette of ${subject}. \n\nSoft piano music builds.\n\nNARRATOR (Softly)\nPerfection takes time.\n\nReveal '${subject}' in golden light.`,
            score: 8.8,
            duration_seconds: 30,
            image_prompt: `Cinematic shot of ${subject}, dramatic lighting, shallow depth of field, 8k resolution, moody atmosphere`
        },
        {
            id: `concept_${Date.now()}_3`,
            title: `Authentic: ${cleanSubject}`,
            style: 'UGC / Native',
            description: `Handheld, raw, and relatable take on '${subject}'. Feels like a friend sharing a discovery.`,
            script: `EXT. STREET - DAY. \n\nSelfie camera angle. \n\nHOST\nOkay, guys, I just found the craziest thing related to ${subject}.\n\nPoints camera at object. Natural lighting.`,
            score: 7.9,
            duration_seconds: 20,
            image_prompt: `Selfie style photo with ${subject} in background, natural lighting, shot on iphone, authentic, candid`
        }
    ];
};

export const AgentApiService = {
  
  toggleLockdown(enabled: boolean) {
    GLOBAL_SECURITY_LOCKDOWN = enabled;
    console.log(`[AgentApiService] Global Security Lockdown set to: ${enabled}`);
  },

  getLockdownStatus() {
    return GLOBAL_SECURITY_LOCKDOWN;
  },

  /**
   * executeAgentWorkflow now supports a callback `onStreamUpdate` to simulate SSE.
   * Instead of returning the full array at once, it yields updates.
   */
  async executeAgentWorkflow(
      payload: AgentWorkflowRequest, 
      onStreamUpdate?: (payload: A2UIPayload) => void
    ): Promise<void> { // Returns void because data is delivered via callback
    
    try {
        // 1. Check Global Kill Switch
        if (GLOBAL_SECURITY_LOCKDOWN) {
            console.warn('[AgentApiService] Request BLOCKED by Global Kill Switch.');
            await new Promise(resolve => setTimeout(resolve, 600));
            if(onStreamUpdate) {
                onStreamUpdate({
                    component_type: UiComponentType.SYSTEM_ALERT,
                    component_data: {
                        status: 'MAINTENANCE',
                        message: "Agent is currently in security lockdown mode. Please contact IT.",
                        reason: "Global Kill Switch Active"
                    }
                });
            }
            return;
        }
        
        const dynamicJobId = `tot_${Date.now()}`;
        const mockConcepts = generateMockConcepts(payload.prompt || "Concept");

        // --- MOCK STREAM SIMULATION (PARALLEL TREE OF THOUGHTS) ---
        // Optimization: "Fan-Out" parallel generation means we wait once, then results gather quickly.
        
        // Step 1: Immediate Orchestrator Ack
        if(onStreamUpdate) {
             onStreamUpdate({
                component_type: 'AsyncStatusBar',
                component_data: {
                    status: 'PENDING',
                    message: 'Orchestrating agent swarm...',
                    job_id: dynamicJobId
                },
                a2a_status: [
                    { service: 'Orchestrator', status: 'IN_PROGRESS', identity_verified: true },
                    { service: 'Brand Guard', status: 'PENDING', identity_verified: true }
                ]
            });
        }
        
        await new Promise(r => setTimeout(r, 600));

        // Step 2: Context Retrieval & Analysis
        if(onStreamUpdate) {
            onStreamUpdate({
                component_type: 'Text',
                component_data: {
                    message: `I've analyzed your request for **"${payload.prompt}"** against the brand guidelines. Launching parallel concept generation for 'High-Energy', 'Cinematic', and 'Authentic' archetypes.`
                },
                a2a_status: [
                    { service: 'Orchestrator', status: 'COMPLETE', identity_verified: true },
                    { service: 'Brand Guard', status: 'APPROVED', identity_verified: true },
                    { service: 'Creative', status: 'IN_PROGRESS', identity_verified: true }
                ]
            });
        }

        await new Promise(r => setTimeout(r, 600));

        // Step 3: START STREAMING CONCEPTS (Selection Card Skeletons)
        // This visualizes the "Fan-Out" phase
        if(onStreamUpdate) {
             onStreamUpdate({
                component_type: 'SelectionCard',
                component_data: {
                    status: 'STREAMING',
                    concepts: [] // 0/3 loaded
                },
                a2a_status: [
                    { service: 'Creative', status: 'IN_PROGRESS', identity_verified: true },
                    { service: 'Legal', status: 'PENDING', identity_verified: true }
                ]
            });
        }

        // --- CRITICAL OPTIMIZATION: PARALLEL EXECUTION WAIT ---
        // Instead of waiting 1.2s + 0.8s + 0.8s, we wait ~2.5s TOTAL for all parallel tasks.
        await new Promise(r => setTimeout(r, 2200));

        // Step 4: Gather Results (Concepts arrive in rapid succession)
        if(onStreamUpdate) {
             onStreamUpdate({
                component_type: 'SelectionCard',
                component_data: {
                    status: 'STREAMING',
                    concepts: [mockConcepts[0]] // 1/3 loaded
                },
                a2a_status: [
                     { service: 'Creative', status: 'IN_PROGRESS', identity_verified: true },
                ]
            });
        }
        
        // Short gathering delay
        await new Promise(r => setTimeout(r, 200));

        if(onStreamUpdate) {
             onStreamUpdate({
                component_type: 'SelectionCard',
                component_data: {
                    status: 'STREAMING',
                    concepts: [mockConcepts[0], mockConcepts[1]] // 2/3 loaded
                },
                a2a_status: [
                     { service: 'Creative', status: 'IN_PROGRESS', identity_verified: true },
                ]
            });
        }
        
        // Short gathering delay
        await new Promise(r => setTimeout(r, 200));

        // Step 5: Final Payload (Ready)
         if(onStreamUpdate) {
             onStreamUpdate({
                component_type: 'SelectionCard',
                component_data: {
                    status: 'READY',
                    concepts: mockConcepts // 3/3 loaded
                },
                a2a_status: [
                    { service: 'Brand Guard', status: 'APPROVED', identity_verified: true },
                    { service: 'Safety', status: 'APPROVED', identity_verified: true },
                    { service: 'Creative', status: 'COMPLETE', identity_verified: false },
                    { service: 'Legal', status: 'CONDITIONAL_APPROVAL', identity_verified: true }
                ]
            });
        }

    } catch (error) {
      console.warn('[AgentApiService] Network request failed.', error);
       if(onStreamUpdate) {
             onStreamUpdate({
                component_type: UiComponentType.SYSTEM_ALERT,
                component_data: {
                    reason: "Network Error",
                    message: "Failed to connect to agent swarm."
                }
            });
        }
    }
  }
};
