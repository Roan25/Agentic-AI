import React, { useState, useRef } from 'react';
import { AspectRatio, Format, ImageQuality, VideoQuality, VoiceStyle, Language, TargetDuration } from '../types';
import { Icon } from './Icon';
import { Dropdown } from './Dropdown';
import { VoiceOverRecorder } from './VoiceOverRecorder';

interface PromptBarProps {
  onGenerate: (
    prompt: string, 
    aspectRatio: AspectRatio, 
    format: Format,
    imageQuality: ImageQuality,
    videoQuality: VideoQuality,
    voiceStyle: VoiceStyle,
    language: Language,
    targetDuration: TargetDuration,
    uploadedImage?: { data: string, mimeType: string },
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

const targetDurationOptions: { value: TargetDuration; label: string }[] = [
  { value: 'short', label: '< 15 seconds' },
  { value: 'medium', label: '15-60 seconds' },
  { value: 'long', label: '1-5 minutes' },
  { value: 'feature', label: '> 5 minutes' },
];

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [format, setFormat] = useState<Format>('video');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('1080p');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('720p');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('professional');
  const [language, setLanguage] = useState<Language>('en-US');
  const [targetDuration, setTargetDuration] = useState<TargetDuration>('short');
  const [uploadedImage, setUploadedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVoiceOverModalOpen, setIsVoiceOverModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || uploadedImage) {
      onGenerate(prompt.trim(), aspectRatio, format, imageQuality, videoQuality, voiceStyle, language, targetDuration, uploadedImage);
      setUploadedImage(null);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({ data: reader.result as string, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTranscriptReady = (transcript: string) => {
    setPrompt(transcript);
    setIsVoiceOverModalOpen(false);
  };

  const renderSettings = () => {
    switch(format) {
      case 'image':
        return (
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
              options={imageQualityOptions}
              value={imageQuality}
              onChange={(v) => setImageQuality(v)}
              disabled={isLoading}
            />
          </>
        );
      case 'video':
        return (
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
              options={videoQualityOptions}
              value={videoQuality}
              onChange={(v) => setVideoQuality(v)}
              disabled={isLoading}
            />
             <Dropdown
                label="Target Duration"
                options={targetDurationOptions}
                value={targetDuration}
                onChange={(v) => setTargetDuration(v)}
                disabled={isLoading}
            />
          </>
        );
        case 'voiceover':
           return (
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
                <Dropdown
                    label="Target Duration"
                    options={targetDurationOptions}
                    value={targetDuration}
                    onChange={(v) => setTargetDuration(v)}
                    disabled={isLoading}
                />
              </>
            );
        default:
          return null;
    }
  }


  return (
    <>
      <footer className="mt-auto bg-transparent z-10 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--color-background-secondary)]/80 backdrop-blur-md border border-[var(--color-border-primary)] rounded-xl p-4 shadow-2xl transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(192,132,252,0.3)] focus-within:border-[var(--color-accent)]/80">
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-2'>
               <Dropdown
                  label="Format"
                  options={formatOptions}
                  value={format}
                  onChange={(v) => setFormat(v)}
                  disabled={isLoading}
              />
              {renderSettings()}
            </div>
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              {uploadedImage && (
                  <div className="relative flex-shrink-0">
                      <img src={uploadedImage.data} alt="Uploaded preview" className="w-11 h-11 object-cover rounded-lg" />
                      <button
                          type="button"
                          onClick={() => setUploadedImage(null)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                          aria-label="Remove uploaded image"
                      >
                          <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                      </button>
                  </div>
              )}
              {format === 'video' && (
                <>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="Upload image to animate"
                    className="flex-shrink-0 p-3 rounded-lg bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)] text-[var(--color-text-primary)] disabled:opacity-50"
                  >
                    <Icon path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="w-5 h-5" />
                  </button>
                </>
              )}
              {format === 'voiceover' && (
                  <button
                    type="button"
                    onClick={() => setIsVoiceOverModalOpen(true)}
                    disabled={isLoading}
                    title="Record voice script"
                    className="flex-shrink-0 p-3 rounded-lg bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)] text-[var(--color-text-primary)] disabled:opacity-50"
                  >
                    <Icon path="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5" className="w-5 h-5" />
                  </button>
              )}
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={format === 'video' && uploadedImage ? "Describe how to animate the image..." : "e.g., 'A vibrant jungle...'"}
                className="w-full flex-grow bg-[var(--color-background-tertiary)] border border-[var(--color-border-primary)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || (!prompt.trim() && !uploadedImage)}
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
      {isVoiceOverModalOpen && (
        <VoiceOverRecorder
          onClose={() => setIsVoiceOverModalOpen(false)}
          onTranscriptReady={handleTranscriptReady}
        />
      )}
    </>
  );
};
