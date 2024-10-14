import { useContext } from 'react';

import { FieldGroupContext } from '../components/FieldGroupProvider';

function useFormGroupContext() {
  const settings = useContext(FieldGroupContext);
  return settings;
}

export default useFormGroupContext;
