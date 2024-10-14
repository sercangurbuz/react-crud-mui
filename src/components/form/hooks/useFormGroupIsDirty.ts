import useFormFieldsIsDirty from './useFormFieldsIsDirty';
import useFormHelper from './useFormHelper';

interface UseFormGroupIsDirtyOptions {
  groupName: string;
}

/**
 * Check fields in given group is invalid
 */
function useFormGroupIsDirty({ groupName }: UseFormGroupIsDirtyOptions) {
  const { groups } = useFormHelper();
  const fields = groups(groupName);
  const isDirty = useFormFieldsIsDirty({ name: fields });

  return isDirty;
}

export default useFormGroupIsDirty;
