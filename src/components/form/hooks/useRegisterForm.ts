import { useEffect } from 'react';
import { FieldValues, Path } from 'react-hook-form';

import { UseFormReturn } from './useForm';
import useFormCollectionContext from './useFormCollectionContext';

interface UseRegisterFormOptions<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}

function useRegisterForm<TFieldValues extends FieldValues>({
  name,
  form,
}: UseRegisterFormOptions<TFieldValues>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { registerForm, unRegisterForm } = useFormCollectionContext();

  useEffect(() => {
    registerForm({ form: form as UseFormReturn<FieldValues>, name });
  }, [form, name, registerForm]);

  useEffect(
    () => () => {
      unRegisterForm(name);
    },
    [name, unRegisterForm],
  );
}

export default useRegisterForm;
