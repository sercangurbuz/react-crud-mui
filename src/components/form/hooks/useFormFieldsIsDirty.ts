import { FieldValues, get, useFormState, UseFormStateProps } from 'react-hook-form';

export type UseFormFieldsIsDirtyOptions<TFieldValues extends FieldValues> = Pick<
  UseFormStateProps<TFieldValues>,
  'name'
>;

function useFormFieldsIsDirty<TFieldValues extends FieldValues>({
  name,
}: UseFormFieldsIsDirtyOptions<TFieldValues>) {
  const { dirtyFields } = useFormState({ name });

  if (Array.isArray(name)) {
    const result = name?.some((field) => !!get(dirtyFields, field));
    return result;
  }

  return name ? !!get(dirtyFields, name as string) : false;
}

export default useFormFieldsIsDirty;
