import { useState, useEffect, useRef } from 'react';

export type QualityTier = 'high' | 'medium' | 'low';

/**
 * Hook to dynamically adapt 3D rendering parameters (DPR, particle counts, shadow samples)
 * based on real-time framerate measurements to guarantee a smooth 60 FPS experience.
 */
export function useAdaptiveQuality(): {
  tier: QualityTier;
  dpr: number;
  particleMultiplier: number;
  reportFrameTime: (deltaMs: number) => void;
} {
  const [tier, setTier] = useState<QualityTier>('high');
  const frameTimes = useRef<number[]>([]);
  const lastCheck = useRef<number>(Date.now());

  const reportFrameTime = (deltaMs: number) => {
    frameTimes.current.push(deltaMs);
    if (frameTimes.current.length > 60) {
      frameTimes.current.shift();
    }

    const now = Date.now();
    if (now - lastCheck.current > 3000 && frameTimes.current.length >= 30) {
      lastCheck.current = now;
      const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
      // If average frame time > 22ms (< 45 FPS), throttle quality down
      if (avg > 25 && tier === 'high') {
        setTier('medium');
      } else if (avg > 35 && tier === 'medium') {
        setTier('low');
      }
    }
  };

  const dpr = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : tier === 'medium' ? 1.5 : 1)
    : 1;

  const particleMultiplier = tier === 'high' ? 1.0 : tier === 'medium' ? 0.6 : 0.3;

  return { tier, dpr, particleMultiplier, reportFrameTime };
}
