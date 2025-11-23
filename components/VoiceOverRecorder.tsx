import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from './Icon';

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface VoiceOverRecorderProps {
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}

type RecordingState = 'idle' | 'permission_pending' | 'recording' | 'paused' | 'recorded' | 'error';

export const VoiceOverRecorder: React.FC<VoiceOverRecorderProps> = ({ onClose, onTranscriptReady }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const stopRecordingAndRecognition = useCallback(() => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    setRecordingState('permission_pending');
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setAudioUrl(null);
    audioChunksRef.current = [];

    if (!SpeechRecognitionAPI) {
        setError("Speech recognition is not supported in your browser.");
        setRecordingState('error');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            setRecordingState('recorded');
            stream.getTracks().forEach(track => track.stop());
        };

        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            let tempInterim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    tempInterim += event.results[i][0].transcript;
                }
            }
            setTranscript(prev => prev + finalTranscript);
            setInterimTranscript(tempInterim);
        };

        recognitionRef.current.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`);
            console.error('Speech recognition error', event.error);
        };
        
        recognitionRef.current.onend = () => {
            console.log('Speech recognition service ended.');
        };

        mediaRecorderRef.current.start();
        recognitionRef.current.start();
        setRecordingState('recording');

    } catch (err) {
        setError("Microphone permission denied. Please allow microphone access in your browser settings.");
        setRecordingState('error');
    }
  }, [stopRecordingAndRecognition]);

  const handleStop = () => {
    stopRecordingAndRecognition();
  };
  
  const handlePause = () => {
      if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.pause();
          recognitionRef.current?.stop();
          setRecordingState('paused');
      }
  };

  const handleResume = () => {
      if (mediaRecorderRef.current?.state === 'paused') {
          mediaRecorderRef.current.resume();
          recognitionRef.current?.start();
          setRecordingState('recording');
      }
  };
  
  const handleRetake = () => {
      stopRecordingAndRecognition();
      setRecordingState('idle');
      setTranscript('');
      setInterimTranscript('');
      setAudioUrl(null);
  };

  const handleUseTranscript = () => {
      onTranscriptReady(transcript);
  };
  
  useEffect(() => {
    return () => {
      stopRecordingAndRecognition();
    };
  }, [stopRecordingAndRecognition]);

  const renderControls = () => {
      switch (recordingState) {
          case 'recording':
              return (
                  <div className="flex justify-center gap-4">
                      <button onClick={handlePause} className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-bold flex items-center gap-2">
                          <Icon path="M15.75 5.25v13.5m-6-13.5v13.5" className="w-6 h-6" /> Pause
                      </button>
                      <button onClick={handleStop} className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                          <Icon path="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" className="w-6 h-6" /> Stop
                      </button>
                  </div>
              );
          case 'paused':
              return (
                  <div className="flex justify-center gap-4">
                      <button onClick={handleResume} className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2">
                          <Icon path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" className="w-6 h-6" /> Resume
                      </button>
                      <button onClick={handleStop} className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2">
                          <Icon path="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" className="w-6 h-6" /> Stop
                      </button>
                  </div>
              );
          case 'recorded':
              return (
                  <div className="flex flex-col items-center gap-4 w-full">
                      {audioUrl && <audio ref={audioRef} src={audioUrl} controls className="w-full max-w-md" />}
                      <div className="flex justify-center gap-4">
                          <button onClick={handleRetake} className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold">
                              Retake
                          </button>
                          <button onClick={handleUseTranscript} disabled={!transcript.trim()} className="px-6 py-3 rounded-lg bg-[var(--gradient-primary)] hover:opacity-90 text-white font-bold disabled:opacity-50">
                              Use Transcript
                          </button>
                      </div>
                  </div>
              );
          case 'idle':
          case 'permission_pending':
          case 'error':
          default:
              return (
                  <button onClick={startRecording} disabled={recordingState === 'permission_pending'} className="px-8 py-4 rounded-full bg-[var(--gradient-primary)] hover:opacity-90 text-white font-bold flex items-center gap-3 disabled:opacity-50">
                      <Icon path="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5" className="w-8 h-8" />
                      {recordingState === 'permission_pending' ? 'Waiting...' : 'Start Recording'}
                  </button>
              );
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onMouseDown={onClose}>
        <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh]" onMouseDown={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--color-border-primary)] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Record Voiceover Script</h2>
                <button onClick={onClose} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)]" aria-label="Close recorder">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                </button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto flex flex-col gap-4 items-center">
                <p className="text-sm text-center text-[var(--color-text-secondary)] -mt-2 mb-2 max-w-md">
                    Record your script, and our AI will generate a professional voiceover from the transcribed text.
                </p>
                <div className="flex-grow w-full bg-[var(--color-background)] rounded-lg p-4 text-lg min-h-[150px]">
                    <p className="text-[var(--color-text-primary)]">{transcript}<span className="text-[var(--color-text-secondary)]">{interimTranscript}</span></p>
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {recordingState === 'recording' && (
                    <div className="flex items-center justify-center gap-2 text-[var(--color-text-accent)]">
                        <div className="w-3 h-3 bg-[var(--color-text-accent)] rounded-full animate-pulse"></div>
                        <span>Recording...</span>
                    </div>
                )}
            </div>
            <div className="p-6 border-t border-[var(--color-border-primary)] flex justify-center">
                {renderControls()}
            </div>
        </div>
    </div>
  );
};