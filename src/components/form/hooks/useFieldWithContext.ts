import { useContext } from 'react';

import { FieldWithContext, FieldWithProviderProps } from '../components/FieldWithProvider';

function useFieldWithContext() {
  const settings = useContext(FieldWithContext) as Required<FieldWithProviderProps>;
  return settings;
}

export default useFieldWithContext;
