export interface CreativeConcept {
  id: number;
  title: string;
  description: string;
  style: string;
  image_prompt: string;
  video_prompt?: string;
}

export interface GeneratedAssets {
  script: string;
  imageUrl: string;
  voiceover: string;
}

export interface GeneratedCampaign extends CreativeConcept {
  mediaUrl: string;
  format: Format;
}

export type BrandGuidelines = string[];

export interface TestCase {
  caseId: string;
  type: 'Happy Path' | 'Ambiguity' | 'Adversarial' | 'Contextual';
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
export type Format = "image" | "video";
export type ImageQuality = "1K" | "2K" | "4K";
export type VideoQuality = "720p" | "1080p";
