import { useContext } from 'react';

import { FormDisabledContext, FormDisabledProviderProps } from '../components/FormDisabledProvider';

function useFormDisabled() {
  const disabled = useContext(FormDisabledContext) as FormDisabledProviderProps;
  return disabled;
}

export default useFormDisabled;
