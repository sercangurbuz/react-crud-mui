import { useCallback, useRef, useState } from 'react';

import { ServerError } from '../utils';
import useMounted from './useMounted';

interface UseWaitAsyncOptions {
  loading?: boolean;
  error?: ServerError;
}

interface UseWaitAsyncEvents<TData> {
  done?: (data: TData) => void;
  failed?: (err: ServerError) => void;
}

function useWaitAsync<TData>({
  error: initialError,
  loading: initialLoading,
}: UseWaitAsyncOptions = {}) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const isMounted = useMounted();
  const lastFetchId = useRef(0);
  const [loading, setLoading] = useState<boolean | undefined>(initialLoading);
  const [error, setError] = useState<ServerError | undefined>(initialError);

  const wait = useCallback(
    async (effect: Promise<TData>, events?: UseWaitAsyncEvents<TData>) => {
      //keep track of request count to prevent race condition
      lastFetchId.current += 1;
      const fetchId = lastFetchId.current;

      setLoading(true);
      try {
        const data = await effect;

        if (fetchId !== lastFetchId.current || !isMounted) {
          return;
        }

        events?.done?.(data);
        return data;
      } catch (error) {
        if (isMounted) {
          setError(error as ServerError);
          events?.failed?.(error as ServerError);
          throw error;
        }
      } finally {
        if (isMounted) {
          setLoading(undefined);
        }
      }
    },
    [isMounted],
  );

  const reset = useCallback(() => {
    setLoading(undefined);
    setError(undefined);
  }, []);

  return [wait, loading, error, reset, setLoading, setError] as const;
}

export default useWaitAsync;
