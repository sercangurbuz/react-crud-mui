import { useEffect, useReducer } from 'react';

import { useMountEffect, useUpdateEffect } from '../../hooks';

const useFormInitEffect: typeof useEffect = (effect) => {
  const [value, rerender] = useReducer(() => ({}), {});

  useMountEffect(() => {
    rerender();
  }, []);

  useUpdateEffect(() => {
    effect();
  }, [value]);
};

export default useFormInitEffect;
