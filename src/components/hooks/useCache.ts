import { useRef, useCallback } from 'react';

export default <TModel, TKey = string>() => {
  const internalCache = useRef<Map<TKey, TModel> | null>(null);
  if (!internalCache.current) {
    internalCache.current = new Map<TKey, TModel>();
  }

  const getCache = useCallback(
    (value: TKey) => {
      if (!value) {
        return;
      }

      if (!internalCache.current!.has(value)) {
        return undefined;
      }
      return internalCache.current!.get(value);
    },
    [internalCache]
  );

  const setCache = useCallback((key: TKey, value: TModel) => {
    internalCache.current!.set(key, value);
  }, []);

  const clearCache = useCallback(() => {
    internalCache.current!.clear();
  }, []);

  return [getCache, setCache, internalCache.current, clearCache] as const;
};
