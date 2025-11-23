import React, { useState, useRef } from 'react';
import { AspectRatio, Format, ImageQuality, VideoQuality, VoiceStyle, Language } from '../types';
import { Icon } from './Icon';
import { Dropdown } from './Dropdown';

interface PromptBarProps {
  onGenerate: (
    prompt: string, 
    aspectRatio: AspectRatio, 
    format: Format,
    imageQuality: ImageQuality,
    videoQuality: VideoQuality,
    voiceStyle: VoiceStyle,
    language: Language,
  ) => void;
  isLoading: boolean;
}

const formatOptions: { value: Format; label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'voiceover', label: 'Voiceover' },
];

const aspectRatioOptions: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
  { value: '9:16', label: '9:16' },
];

const imageQualityOptions: { value: ImageQuality; label: string }[] = [
  { value: '720p', label: '720p (SD)' },
  { value: '1080p', label: '1080p (HD)' },
  { value: '1440p', label: '1440p (QHD)' },
  { value: '2160p', label: '2160p (4K)' },
];

const videoQualityOptions: { value: VideoQuality; label: string }[] = [
  { value: '720p', label: '720p (SD)' },
  { value: '1080p', label: '1080p (HD)' },
  { value: '1440p', label: '1440p (QHD)' },
  { value: '2160p', label: '2160p (4K)' },
];

const voiceStyleOptions: { value: VoiceStyle; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'calm', label: 'Calm' },
];

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
];

// Cast window to any to access SpeechRecognition and webkitSpeechRecognition,
// and rename the constant to avoid shadowing the SpeechRecognition type.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [format, setFormat] = useState<Format>('image');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('1080p');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('1080p');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('professional');
  const [language, setLanguage] = useState<Language>('en-US');
  const [isRecording, setIsRecording] = useState(false);
  // FIX: The `SpeechRecognition` type is not available in the environment, so using `any`.
  const recognitionRef = useRef<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim(), aspectRatio, format, imageQuality, videoQuality, voiceStyle, language);
    }
  };
  
  const qualityOptions = format === 'image' ? imageQualityOptions : videoQualityOptions;
  const currentQuality = format === 'image' ? imageQuality : videoQuality;
  
  const handleQualityChange = (value: ImageQuality | VideoQuality) => {
    if (format === 'image') {
      setImageQuality(value as ImageQuality);
    } else {
      setVideoQuality(value as VideoQuality);
    }
  }

  const handleMicClick = () => {
    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => (prev ? prev + ' ' : '') + transcript);
    };
    
    recognition.onerror = (event: any) => {
      // The 'no-speech' error is a common timeout event, and 'aborted' can occur if the user
      // stops recognition manually. Neither of these are critical failures.
      // We handle them gracefully by logging to the console without showing a disruptive alert.
      // The `onend` event will fire after this, resetting the recording state.
      if (event.error === 'no-speech' || event.error === 'aborted') {
        console.warn(`Speech recognition event: ${event.error}`);
        return;
      }
      
      // For other, more critical errors, we will log them and alert the user.
      console.error('Speech recognition error', event.error);
      alert(`Speech recognition error: ${event.error}`);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-transparent z-10">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-[var(--color-background-secondary)]/80 backdrop-blur-md border border-[var(--color-border-primary)] rounded-xl p-4 shadow-2xl transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(192,132,252,0.3)] focus-within:border-[var(--color-accent)]/80">
          <div className='grid grid-cols-3 gap-4 mb-6 pt-2'>
             <Dropdown
                label="Format"
                options={formatOptions}
                value={format}
                onChange={(v) => setFormat(v)}
                disabled={isLoading}
            />
            {format !== 'voiceover' ? (
              <>
                <Dropdown
                    label="Aspect Ratio"
                    options={aspectRatioOptions}
                    value={aspectRatio}
                    onChange={(v) => setAspectRatio(v)}
                    disabled={isLoading}
                />
                <Dropdown
                    label="Quality"
                    options={qualityOptions}
                    value={currentQuality}
                    onChange={handleQualityChange}
                    disabled={isLoading}
                />
              </>
            ) : (
              <>
                <Dropdown
                  label="Voice Style"
                  options={voiceStyleOptions}
                  value={voiceStyle}
                  onChange={(v) => setVoiceStyle(v)}
                  disabled={isLoading}
                />
                <Dropdown
                  label="Language"
                  options={languageOptions}
                  value={language}
                  onChange={(v) => setLanguage(v)}
                  disabled={isLoading}
                />
              </>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A vibrant jungle...' or try 'A poster with our logo in pink'"
              className="w-full flex-grow bg-[var(--color-background-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
              disabled={isLoading}
            />
            {format === 'voiceover' && SpeechRecognitionAPI && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                  isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording voice prompt'}
              >
              {isRecording 
                ? <Icon path="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" className="w-5 h-5 text-white" />
                : <Icon path="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5" className="w-5 h-5 text-white" />
              }
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-[var(--gradient-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5"/>
              )}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};