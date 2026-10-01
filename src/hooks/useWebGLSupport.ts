import { useState, useEffect } from 'react';

/**
 * Hook to detect WebGL and WebGL2 hardware support.
 * Ensures graceful fallback when running in headless environments or on machines with disabled GPU acceleration.
 */
export function useWebGLSupport(): { isSupported: boolean; isChecked: boolean; error: string | null } {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl) {
        setIsSupported(false);
        setError('WebGL hardware acceleration is unavailable on this device/browser.');
      } else {
        setIsSupported(true);
        setError(null);
      }
    } catch (e) {
      setIsSupported(false);
      setError((e as Error)?.message || 'Failed to initialize WebGL context.');
    } finally {
      setIsChecked(true);
    }
  }, []);

  return { isSupported, isChecked, error };
}
