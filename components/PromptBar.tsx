import React, { useState } from 'react';
import { AspectRatio, Format, ImageQuality, VideoQuality } from '../types';
import { Icon } from './Icon';

interface PromptBarProps {
  onGenerate: (
    prompt: string, 
    aspectRatio: AspectRatio, 
    format: Format,
    imageQuality: ImageQuality,
    videoQuality: VideoQuality
  ) => void;
  isLoading: boolean;
}

const OptionButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
      isActive
        ? 'bg-fuchsia-500 text-white shadow-lg'
        : 'bg-gray-700/60 hover:bg-gray-600/80 text-gray-300'
    }`}
  >
    {children}
  </button>
);

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [format, setFormat] = useState<Format>('image');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('1K');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('1080p');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim(), aspectRatio, format, imageQuality, videoQuality);
    }
  };

  const renderQualityOptions = () => {
    if (format === 'image') {
      return (
        <>
          <span className="text-xs font-semibold text-gray-400">Quality:</span>
          <OptionButton onClick={() => setImageQuality('1K')} isActive={imageQuality === '1K'} disabled={isLoading}>1K</OptionButton>
          <OptionButton onClick={() => setImageQuality('2K')} isActive={imageQuality === '2K'} disabled={isLoading}>2K</OptionButton>
          <OptionButton onClick={() => setImageQuality('4K')} isActive={imageQuality === '4K'} disabled={isLoading}>4K</OptionButton>
        </>
      )
    }
     if (format === 'video') {
      return (
        <>
          <span className="text-xs font-semibold text-gray-400">Quality:</span>
          <OptionButton onClick={() => setVideoQuality('720p')} isActive={videoQuality === '720p'} disabled={isLoading}>720p</OptionButton>
          <OptionButton onClick={() => setVideoQuality('1080p')} isActive={videoQuality === '1080p'} disabled={isLoading}>1080p</OptionButton>
        </>
      )
    }
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-transparent">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-2 shadow-2xl flex flex-col gap-3 transition-all duration-300 focus-within:shadow-fuchsia-500/30 focus-within:border-fuchsia-500/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">Format:</span>
              <OptionButton onClick={() => setFormat('image')} isActive={format === 'image'} disabled={isLoading}>Image</OptionButton>
              <OptionButton onClick={() => setFormat('video')} isActive={format === 'video'} disabled={isLoading}>Video</OptionButton>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">Aspect:</span>
              <OptionButton onClick={() => setAspectRatio('16:9')} isActive={aspectRatio === '16:9'} disabled={isLoading}>16:9</OptionButton>
              <OptionButton onClick={() => setAspectRatio('1:1')} isActive={aspectRatio === '1:1'} disabled={isLoading}>1:1</OptionButton>
              <OptionButton onClick={() => setAspectRatio('9:16')} isActive={aspectRatio === '9:16'} disabled={isLoading}>9:16</OptionButton>
            </div>
            <div className="flex items-center gap-2">
              {renderQualityOptions()}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A vibrant jungle...' or try 'A poster with our logo in pink'"
              className="w-full flex-grow bg-transparent p-3 focus:outline-none text-white placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
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
