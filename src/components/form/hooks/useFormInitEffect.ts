import { useEffect, useReducer } from 'react';

import { useMountEffect, useUpdateEffect } from '../../hooks';

const useFormInitEffect: typeof useEffect = (effect, deps) => {
  const [value, rerender] = useReducer(() => ({}), {});

  useMountEffect(() => {
    rerender();
  }, []);

  useUpdateEffect(() => {
    effect();
  }, [value, ...(deps ?? [])]);
};

export default useFormInitEffect;
