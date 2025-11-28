import { useState, useEffect, useRef, useCallback } from 'react';
import { pollForJobCompletion } from '../services/geminiService';
import { GeneratedCampaign } from '../types';

interface AsyncJobState {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  progress: number;
  resultUrl: string | null;
  error: string | null;
}

export const useAsyncJob = (
  jobId: string | undefined, 
  onComplete?: (url: string) => void
) => {
  const [state, setState] = useState<AsyncJobState>({
    status: 'PENDING',
    progress: 0,
    resultUrl: null,
    error: null,
  });

  const startTimeRef = useRef<number>(Date.now());
  const pollIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Simulated progress simulation (Zeno's paradox)
  // Rapidly gets to 30%, then 60%, then slows down to 90%
  const updateSimulatedProgress = useCallback(() => {
    setState(prev => {
        if (prev.status === 'COMPLETE') return prev;
        
        let increment = 0;
        if (prev.progress < 30) increment = 4;       // Very Fast start
        else if (prev.progress < 60) increment = 1.5;  // Moderate
        else if (prev.progress < 90) increment = 0.2; // Crawl
        
        return { ...prev, progress: Math.min(prev.progress + increment, 90) };
    });
  }, []);

  useEffect(() => {
    if (!jobId) return;

    startTimeRef.current = Date.now();
    isMountedRef.current = true;
    setState(prev => ({ ...prev, status: 'PROCESSING', error: null }));

    const poll = async () => {
      if (!isMountedRef.current) return;

      try {
        const result: GeneratedCampaign = await pollForJobCompletion(jobId);
        
        // Update simulation
        updateSimulatedProgress();

        if (result.status === 'complete' || result.status === 'FAILED') {
          setState({
            status: result.status === 'complete' ? 'COMPLETE' : 'FAILED',
            progress: 100,
            resultUrl: result.mediaUrl || null,
            error: result.status === 'FAILED' ? 'Job execution failed on server.' : null,
          });

          if (result.status === 'complete' && result.mediaUrl && onComplete) {
            onComplete(result.mediaUrl);
          }
        } else {
          // Adaptive Polling Strategy
          // If we've been polling for > 10s or progress is high, slow down to save battery
          const elapsed = Date.now() - startTimeRef.current;
          const nextInterval = elapsed > 10000 ? 5000 : 2000; 
          
          pollIntervalRef.current = setTimeout(poll, nextInterval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        // Robustness: Don't crash on network blip, just retry with delay
        pollIntervalRef.current = setTimeout(poll, 5000); 
      }
    };

    poll();

    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
    };
  }, [jobId, updateSimulatedProgress, onComplete]);

  return state;
};
