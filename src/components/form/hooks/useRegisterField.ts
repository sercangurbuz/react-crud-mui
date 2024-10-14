import { useEffect } from 'react';
import { FieldValues, Path } from 'react-hook-form';

import useFormGroupContext from './useFormGroupContext';
import useFormHelper from './useFormHelper';

interface UseRegisterFieldOptions<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: React.ReactNode;
}

function useRegisterField<TFieldValues extends FieldValues>({
  name,
}: UseRegisterFieldOptions<TFieldValues>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { registerField, unRegisterField } = useFormHelper();
  const { group } = useFormGroupContext();

  useEffect(() => {
    registerField!({ group, name });
  }, [group, name, registerField]);

  useEffect(() => () => unRegisterField(name), [name, unRegisterField]);
}

export default useRegisterField;
