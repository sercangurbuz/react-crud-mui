import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (value: any) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return ref.current;
};
