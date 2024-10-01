import { FieldValues, get, useFormState, UseFormStateProps } from 'react-hook-form';

export type UseFormFieldsIsInValidOptions<TFieldValues extends FieldValues> = Pick<
  UseFormStateProps<TFieldValues>,
  'name'
>;

function useFormFieldsIsInValid<TFieldValues extends FieldValues>({
  name,
}: UseFormFieldsIsInValidOptions<TFieldValues>) {
  const { errors } = useFormState({ name });

  if (Array.isArray(name)) {
    const result = name?.some((field) => !!get(errors, field));
    return result;
  }

  return name ? !!get(errors, name as string) : false;
}

export default useFormFieldsIsInValid;
