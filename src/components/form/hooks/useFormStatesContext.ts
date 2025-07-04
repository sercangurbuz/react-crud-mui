import { useContext } from 'react';

import { FormStatesContext, FormStatesProviderProps } from '../components/FormStatesProvider';

function useFormStatesContext() {
  const settings = useContext(FormStatesContext) as Required<FormStatesProviderProps>;
  return settings;
}

export default useFormStatesContext;
