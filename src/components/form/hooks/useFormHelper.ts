import { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { FormHelperContext, FormHelperContextValue } from '../components/FormHelperProvider';

/**
 * Custom form context wrapper of RHF with some extra functions
 */
function useFormHelper<TFieldValues extends FieldValues = FieldValues>() {
  return useContext(FormHelperContext) as FormHelperContextValue<TFieldValues>;
}

export default useFormHelper;
