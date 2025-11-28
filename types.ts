
export interface CreativeConcept {
  id: string | number;
  title: string;
  description: string;
  style: string;
  image_prompt: string;
  video_prompt?: string;
  voiceover_prompt?: string;
  duration_seconds?: number;
  evaluation?: EvaluationScore;
  score?: number; // Backend Judge Score
  script?: string;
}

export interface GeneratedAssets {
  script: string;
  imageUrl: string;
  voiceover: string;
}

export interface ObservabilityMetrics {
  complianceScore: number;
  toolFailoverUsed: boolean;
  memoryStatus: 'not_triggered' | 'preference_logged' | 'confirmation_triggered';
  retries: number;
}

export interface GeneratedCampaign extends CreativeConcept {
  mediaUrl: string;
  format: Format;
  observability: ObservabilityMetrics;
  jobId?: string;
  status?: 'processing' | 'complete' | 'FAILED';
}

export type BrandGuidelines = string[];

export interface TestCase {
  caseId: string;
  category: 'Effectiveness' | 'Safety & Alignment' | 'Robustness' | 'Efficiency';
  scenario: string;
  userPrompt: string;
  expectedBehavior: string;
}

export interface EvaluationScore {
  score: number;
  reasoning: string;
  violation_detected: boolean;
}

export interface TestResult {
  testCase: TestCase;
  trajectory: string[];
  finalAction: string;
  evaluation: EvaluationScore | null;
  error?: string;
}

export enum AiResponseType {
    CLARIFICATION,
    REFUSAL,
    ERROR
}

export interface AiResponse {
    type: AiResponseType;
    message: string;
}

export type AspectRatio = "16:9" | "1:1" | "9:16";
export type Format = "image" | "video" | "voiceover";
export type ImageQuality = "720p" | "1080p" | "1440p" | "2160p";
export type VideoQuality = "720p" | "1080p" | "1440p" | "2160p";
export type VoiceStyle = "professional" | "energetic" | "calm";
export type Language = "en-US" | "en-GB" | "es-ES" | "fr-FR";
export type TargetDuration = "short" | "medium" | "long" | "feature";
export type ShowcaseStyle = 'fluid' | 'grid' | 'doodle' | 'vintage';


// AgentOps Dashboard Types
export interface OperationalMetrics {
  tokenConsumption: { value: number; unit: 'tokens'; };
  toolLatency: { value: number; unit: 'ms'; };
  errorRate: { value: number; unit: '%'; };
  totalCost: { value: number; unit: 'USD'; };
}

export interface QualityMetrics {
  guardrailTriggerRate: { value: number; unit: '%'; };
  ragHitRate: { value: number; unit: '%'; };
  userFeedbackScore: { value: number; unit: '/5'; };
  correctionRate: { value: number; unit: '%'; };
}

// A2UI (Agent-to-User-Interface) Protocol Types
export enum UiComponentType {
    SELECTION_CARD = 'SelectionCard',
    ASYNC_STATUS_BAR = 'AsyncStatusBar',
    PERMISSION_TOGGLE = 'PermissionToggle',
    SYSTEM_ALERT = 'SystemAlert',
    TEXT = 'Text' // Added for text bubbles
}

export interface A2AStatus {
    service: string;
    status: string;
    identity_verified: boolean;
}

export interface ComponentData {
    status?: 'APPROVED' | 'PENDING' | 'BLOCKED' | 'IN_PROGRESS' | 'COMPLETE' | 'FAILED';
    message?: string;
    job_id?: string;
    concepts?: CreativeConcept[];
    pattern_to_save?: { style: string };
    reason?: string; // For SystemAlert
    [key: string]: any;
}

export interface UiComponent {
    component_type: UiComponentType | string;
    component_data: ComponentData;
    a2a_status?: A2AStatus[];
}

// Strict contract for the Agent API
export type A2UIPayload = UiComponent;

export interface AgentWorkflowRequest {
    prompt: string;
    session_history?: CreativeConcept[];
    settings?: {
        format: Format;
        aspectRatio: AspectRatio;
        imageQuality: ImageQuality;
        videoQuality: VideoQuality;
        voiceStyle: VoiceStyle;
        language: Language;
        targetDuration: TargetDuration;
    };
    uploadedImage?: { data: string; mimeType: string };
}
