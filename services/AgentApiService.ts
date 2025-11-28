
import { A2UIPayload, AgentWorkflowRequest, UiComponentType } from '../types';

const API_ROOT = '/api';

// MOCK DATA FOR DEMO PURPOSES
// This allows the UI to be fully interactive even without the Python backend running.
const MOCK_AGENT_RESPONSE: A2UIPayload[] = [
    {
        component_type: 'Text',
        component_data: {
            message: "I've analyzed your request against the **Solaris** brand guidelines. The 'High-Energy' archetype aligns best with the Q4 campaign goals."
        },
        a2a_status: [
            { service: 'Brand Guard', status: 'APPROVED', identity_verified: true },
            { service: 'Safety', status: 'PENDING', identity_verified: true }
        ]
    },
    {
        component_type: 'SelectionCard',
        component_data: {
            concepts: [
                {
                    id: 'concept_1',
                    title: 'Neon Drift',
                    style: 'Cyberpunk',
                    description: 'A high-octane race through a rain-slicked neon city. The Solaris energy drink glows with an inner light, matching the city pulse.',
                    script: 'EXT. CITY - NIGHT. Rain falls on asphalt. A racer revs the engine. CLOSE UP: Solaris can on the dashboard...',
                    score: 9.2,
                    duration_seconds: 15,
                    image_prompt: 'Cyberpunk city street at night, neon lights reflecting on wet asphalt, futuristic race car, high contrast, cinematic lighting'
                },
                {
                    id: 'concept_2',
                    title: 'Mountain Zenith',
                    style: 'Cinematic Nature',
                    description: 'Serene sunrise over the Alps. A climber reaches the peak and cracks open a Solaris. The sound echoes across the valley.',
                    script: 'EXT. MOUNTAIN PEAK - DAWN. Wind howls. A gloved hand grips the rock. The sun breaks the horizon...',
                    score: 8.5,
                    duration_seconds: 30,
                    image_prompt: 'Sunrise over the Alps, mountain peak, climber holding an energy drink, golden hour lighting, photorealistic, wide angle'
                },
                {
                    id: 'concept_3',
                    title: 'Urban Flow',
                    style: 'Streetwear',
                    description: 'Fast cuts of parkour athletes moving through the subway system. Graffiti art comes alive and interacts with the product.',
                    script: 'INT. SUBWAY - DAY. Fluorescent lights flicker. A sneaker hits the ground. Motion blur. The can is tossed...',
                    score: 7.8,
                    duration_seconds: 20,
                    image_prompt: 'Urban subway station with graffiti art, parkour athlete in mid-air, motion blur, dynamic angle, streetwear fashion'
                }
            ]
        },
        a2a_status: [
            { service: 'Brand Guard', status: 'APPROVED', identity_verified: true },
            { service: 'Safety', status: 'APPROVED', identity_verified: true },
            { service: 'Creative', status: 'COMPLETE', identity_verified: false }
        ]
    }
];

/**
 * AgentApiService
 * 
 * Responsible for the direct communication with the Backend Model Router.
 * Endpoint: POST /api/v1/agent/execute
 * 
 * Key Features:
 * 1. Consumes the A2UI Stream (or JSON Array).
 * 2. Handles SystemAlerts as data, not HTTP errors.
 * 3. Provides type-safe return values for the Render Dispatcher.
 * 4. MOCK MODE: Returns demo data if the API is unreachable.
 */
export const AgentApiService = {
  
  async executeAgentWorkflow(payload: AgentWorkflowRequest): Promise<A2UIPayload[]> {
    try {
      const response = await fetch(`${API_ROOT}/v1/agent/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', 
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');
      
      // 1. Handle JSON Responses (Success or Structured Error)
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // If the backend returns a structured A2UI payload
        if (Array.isArray(data)) {
            return data as A2UIPayload[];
        } 
        
        // Single object response
        if (data.component_type && data.component_data) {
            return [data] as A2UIPayload[];
        }

        // Generic JSON error
        if (!response.ok && (data.error || data.message)) {
             return [{
                component_type: UiComponentType.SYSTEM_ALERT,
                component_data: {
                    reason: "Workflow Interrupted",
                    message: data.error || data.message || "The agent encountered an unhandled exception."
                }
            }];
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return [];

    } catch (error) {
      console.warn('[AgentApiService] Network request failed. Falling back to MOCK DATA for demo.', error);
      
      // 4. Mock Mode Fallback
      // Simulate network latency for realism
      await new Promise(resolve => setTimeout(resolve, 1500));
      return MOCK_AGENT_RESPONSE;
    }
  }
};