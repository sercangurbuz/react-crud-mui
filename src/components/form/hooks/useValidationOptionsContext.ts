import { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { ValidationOptionsContext } from '../components/ValidationOptionsProvider';
import { ValidationOptions } from './useForm';

function useValidationOptionsContext<TFieldValues extends FieldValues = FieldValues>() {
  const settings = useContext(ValidationOptionsContext) as ValidationOptions<TFieldValues>;
  return settings;
}

export default useValidationOptionsContext;
