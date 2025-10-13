import { useCallback, useState } from 'react';

function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [data, setData] = useState<T>(() => {
    const data = window.localStorage.getItem(key);
    return (data ? JSON.parse(data) : defaultValue) as T;
  });

  const storeData = useCallback(
    (updateValue: T) => {
      setData(updateValue);
      window.localStorage.setItem(key, JSON.stringify(updateValue));
    },
    [key],
  );

  return [data, storeData, setData] as const;
}

export default useLocalStorage;
