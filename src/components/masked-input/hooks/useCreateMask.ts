import { useMemo } from 'react';
import { Props } from 'react-input-mask';

interface UseCreateMaskOptions {
  maskRepeat?: number;
  mask?: Props['mask'];
}

function useCreateMask({ maskRepeat, mask = '*' }: UseCreateMaskOptions) {
  const maskResult = useMemo(() => {
    if (!maskRepeat || maskRepeat === 1) {
      return mask;
    }

    if (!(typeof mask === 'string') || mask.length > 1) {
      throw new Error('mask must be single char when repeat masking');
    }

    return Array.from({ length: maskRepeat }).reduce<string>((m) => (m += mask), '');
  }, [mask, maskRepeat]);

  return maskResult;
}

export default useCreateMask;
