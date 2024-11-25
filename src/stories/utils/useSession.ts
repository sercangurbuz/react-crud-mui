import { useCallback, useState } from 'react';

interface useSessionOptions<T> {
  name?: string;
  defaultValue?: T;
}

function useSession<T extends object>({ name = 'temp', defaultValue }: useSessionOptions<T> = {}) {
  const [value, setValue] = useState<T>(() => {
    const cache = sessionStorage.getItem(name);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return cache ? JSON.parse(cache) : defaultValue;
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
    [name],
  );

  return [value, set] as const;
}

export default useSession;
