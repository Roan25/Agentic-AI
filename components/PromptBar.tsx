import React, { useState, useRef } from 'react';
import { AspectRatio, Format, ImageQuality, VideoQuality, VoiceStyle, Language, TargetDuration } from '../types';
import { Icon } from './Icon';
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

const formatOptions: { value: Format; label: string; icon: string }[] = [
  { value: 'image', label: 'Image', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { value: 'video', label: 'Video', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' },
  { value: 'voiceover', label: 'Voice', icon: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5' },
];

const aspectRatios: AspectRatio[] = ["16:9", "1:1", "9:16"];

// Mini toggle component for inside the bar
const MiniToggle: React.FC<{ 
    label: string; 
    isActive: boolean; 
    onClick: () => void;
    icon?: string;
}> = ({ label, isActive, onClick, icon }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border ${
            isActive 
            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-text-primary)] shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
            : 'bg-white/5 border-transparent text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]'
        }`}
    >
        {icon && <Icon path={icon} className="w-3.5 h-3.5" />}
        {label}
    </button>
);

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [format, setFormat] = useState<Format>('video');
  const [uploadedImage, setUploadedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVoiceOverModalOpen, setIsVoiceOverModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Defaults
  const [imageQuality, setImageQuality] = useState<ImageQuality>('1080p');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('1080p');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('professional');
  const [language, setLanguage] = useState<Language>('en-US');
  const [targetDuration, setTargetDuration] = useState<TargetDuration>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || uploadedImage) {
      onGenerate(prompt.trim(), aspectRatio, format, imageQuality, videoQuality, voiceStyle, language, targetDuration, uploadedImage);
      // Optional: don't clear prompt immediately to allow refinement
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

  return (
    <>
      <div className={`relative w-full transition-all duration-500 transform ${isLoading ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
        
        {/* Settings Popover Area (expands upwards) */}
        {showSettings && (
            <div className="absolute bottom-full left-0 mb-4 w-full bg-[var(--color-background-glass)] backdrop-blur-xl border border-[var(--color-border-primary)] rounded-xl p-4 animate-fade-in shadow-2xl">
                 <div className="flex flex-wrap gap-4 items-center justify-center">
                    <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                        <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-heading">Quality</span>
                        {(['720p', '1080p', '2160p'] as const).map(q => (
                             <button 
                                key={q} 
                                onClick={() => { setImageQuality(q); setVideoQuality(q); }}
                                className={`text-xs px-2 py-1 rounded ${videoQuality === q ? 'text-[var(--color-text-accent)] bg-[var(--color-text-accent)]/10' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                             >
                                 {q}
                             </button>
                        ))}
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-heading">Duration</span>
                        {(['short', 'medium', 'long'] as const).map(d => (
                             <button 
                                key={d} 
                                onClick={() => setTargetDuration(d)}
                                className={`text-xs px-2 py-1 rounded ${targetDuration === d ? 'text-[var(--color-text-accent)] bg-[var(--color-text-accent)]/10' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                             >
                                 {d}
                             </button>
                        ))}
                    </div>
                 </div>
            </div>
        )}

        {/* Main Capsule */}
        <div className="bg-[var(--color-background-glass)] backdrop-blur-2xl border border-[var(--color-border-primary)] rounded-2xl shadow-[var(--shadow-glow)] p-2 flex flex-col gap-2">
            
            {/* Top Toolbar: Format & Ratio */}
            <div className="flex items-center gap-2 px-2 pt-1 pb-1 overflow-x-auto no-scrollbar">
                 <div className="flex bg-black/20 rounded-full p-1 gap-1">
                    {formatOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFormat(opt.value)}
                            className={`p-2 rounded-full transition-all ${format === opt.value ? 'bg-[var(--color-background-tertiary)] text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                            title={opt.label}
                        >
                            <Icon path={opt.icon} className="w-4 h-4" />
                        </button>
                    ))}
                 </div>

                 <div className="w-px h-6 bg-white/10 mx-1"></div>

                 {format !== 'voiceover' && aspectRatios.map(ratio => (
                    <MiniToggle 
                        key={ratio} 
                        label={ratio} 
                        isActive={aspectRatio === ratio} 
                        onClick={() => setAspectRatio(ratio)} 
                    />
                 ))}
                 
                 <div className="flex-grow"></div>
                 
                 <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-full hover:bg-white/5 transition-colors ${showSettings ? 'text-[var(--color-text-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                 >
                     <Icon path="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 18h.008v.008H3.75V18zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="w-5 h-5" />
                 </button>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="flex items-end gap-3 bg-[var(--color-background-secondary)]/50 rounded-xl p-3 border border-white/5 focus-within:border-[var(--color-primary)]/50 focus-within:bg-[var(--color-background-secondary)] transition-all">
                
                {/* Upload Preview */}
                {uploadedImage && (
                    <div className="relative group shrink-0">
                        <img src={uploadedImage.data} alt="Upload" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                        <button
                            type="button"
                            onClick={() => setUploadedImage(null)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Left Actions */}
                <div className="flex flex-col gap-2 pb-1.5">
                    {format === 'video' && (
                        <>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
                                title="Upload Image"
                            >
                                <Icon path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    {format === 'voiceover' && (
                        <button
                            type="button"
                            onClick={() => setIsVoiceOverModalOpen(true)}
                            className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
                            title="Record Audio"
                        >
                             <Icon path="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5" className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Text Area */}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder={
                        format === 'video' && uploadedImage 
                        ? "Describe motion... (e.g., 'Pan right, make the water ripple')" 
                        : "Describe your imagination... (e.g., 'A cyberpunk street at rain, neon lights, 4k')"
                    }
                    className="w-full bg-transparent border-none focus:ring-0 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] resize-none h-[50px] py-3 leading-relaxed"
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={isLoading || (!prompt.trim() && !uploadedImage)}
                    className="shrink-0 p-3 rounded-xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)] hover:opacity-90 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
                >
                     {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                     ) : (
                        <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5" />
                     )}
                </button>
            </form>
        </div>
      </div>
      
      {isVoiceOverModalOpen && (
        <VoiceOverRecorder
          onClose={() => setIsVoiceOverModalOpen(false)}
          onTranscriptReady={handleTranscriptReady}
        />
      )}
    </>
  );
};