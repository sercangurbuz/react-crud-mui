import { useEffect, useRef, useState } from 'react';

export interface SpinDelayOptions {
  /**
   * The delay in milliseconds before the spinner is displayed.
   * @default 500
   */
  delay?: number;
  /**
   * The minimum duration in milliseconds the spinner is displayed.
   * @default 200
   */
  minDuration?: number;

  maxDuration?: number;
  /**
   * Whether to enable the spinner on the server side. If true, `delay` will be
   * ignored, and the spinner will be shown immediately if `loading` is true.
   * @default true
   */
  ssr?: boolean;
}

type State = 'IDLE' | 'DELAY' | 'DISPLAY' | 'EXPIRE' | 'TOO_LONG';

export const defaultOptions = {
  delay: 500,
  minDuration: 200,
  maxDuration: 2500,
  ssr: false,
};

function useIsSSR() {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR;
}

// inspired from https://github.com/smeijer/spin-delay/blob/main/src/index.ts
export function useSpinDelay(loading: boolean, options?: SpinDelayOptions) {
  options = Object.assign({}, defaultOptions, options);

  const isSSR = useIsSSR() && options.ssr;
  const initialState = isSSR && loading ? 'DISPLAY' : 'IDLE';
  const [state, setState] = useState<State>(initialState);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const maxTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (loading && (state === 'IDLE' || isSSR)) {
      clearTimeout(timeout.current);
      clearTimeout(maxTimeout.current);

      const delay = isSSR ? 0 : options.delay;
      timeout.current = setTimeout(() => {
        if (!loading) {
          return setState('IDLE');
        }

        timeout.current = setTimeout(() => {
          setState('EXPIRE');
        }, options.minDuration);

        setState('DISPLAY');
      }, delay);

      maxTimeout.current = setTimeout(() => {
        if (loading) {
          setState('TOO_LONG');
        }
      }, options.maxDuration);

      if (!isSSR) {
        setState('DELAY');
      }
    }

    if (!loading && state !== 'DISPLAY') {
      clearTimeout(timeout.current);
      clearTimeout(maxTimeout.current);
      setState('IDLE');
    }
  }, [loading, state, options.delay, options.minDuration, options.maxDuration, isSSR]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
      clearTimeout(maxTimeout.current);
    };
  }, []);

  const isLoading = state === 'DISPLAY' || state === 'EXPIRE' || state === 'TOO_LONG';
  return { isLoading, state } as const;
}
