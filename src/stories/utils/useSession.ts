import { useCallback, useState } from 'react';

interface useSessionOptions {
  name?: string;
}

function useSession<T>({ name = 'temp' }: useSessionOptions = {}) {
  const [value, setValue] = useState<T>(() => {
    const cache = sessionStorage.getItem(name);
    try {
      return cache ? JSON.parse(cache) : null;
    } catch {
      console.error('useSession fetching error !!!');
      return null;
    }
  });

  const set = useCallback(
    (value: T) => {
      if (value) {
        sessionStorage.setItem(name, JSON.stringify(value));
      } else {
        sessionStorage.removeItem(name);
      }

      setValue(value);
    },
    [name]
  );

  return [value, set] as const;
}

export default useSession;
