import { useContext } from 'react';

import { FieldWithContext } from '../components/FieldWithProvider';

function useFieldWithContext() {
  const settings = useContext(FieldWithContext);
  return settings;
}

export default useFieldWithContext;
