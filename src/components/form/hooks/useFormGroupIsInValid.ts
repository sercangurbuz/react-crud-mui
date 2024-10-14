import useFormFieldsIsInValid from './useFormFieldsIsInValid';
import useFormHelper from './useFormHelper';

interface UseFormGroupIsValidOptions {
  groupName: string;
}

/**
 * Check fields in given group is invalid
 */
function useFormGroupIsInValid({ groupName }: UseFormGroupIsValidOptions) {
  const { groups } = useFormHelper();
  const fields = groups(groupName);
  const isInValid = useFormFieldsIsInValid({ name: fields });

  return isInValid;
}

export default useFormGroupIsInValid;
