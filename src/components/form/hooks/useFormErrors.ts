import { useCallback } from 'react';
import {
  ErrorOption,
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  useFormState,
  UseFormStateProps,
} from 'react-hook-form';

interface UseFormErrors<TFieldValues extends FieldValues = FieldValues> {
  appendUnBoundFields?: boolean;
  name?: UseFormStateProps<TFieldValues>['name'];
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isErrorObject = (value: any): value is ErrorOption => 'message' in value && 'type' in value;

function useFormErrors<TFieldValues extends FieldValues = FieldValues>({
  appendUnBoundFields,
  name,
  disabled,
}: UseFormErrors<TFieldValues>) {
  const { errors } = useFormState();

  /**
   * Create message from Error object
   */
  const createErrorMessage = useCallback((error: ErrorOption) => {
    const errMsg = error.message as string;
    return errMsg;
  }, []);

  const flattenErrors = useCallback(
    (errors: FieldErrors | FieldError, initial: string[] = []): string[] => {
      if (!errors) {
        return initial;
      }

      if (isErrorObject(errors)) {
        // this is for tuple types,
        // Example : Using DateRangePicker bind tis model to [dayjs(),dayjs()]
        const message = createErrorMessage(errors);
        if (message) {
          initial.push(message);
        }
        return initial;
      }
      // filter out fields
      const filteredFields = Object.entries(errors).filter(([field, error]) => {
        if (!error) {
          return false;
        }

        if (!field && !appendUnBoundFields) {
          return false;
        }

        if (name && field) {
          const names = Array.isArray(name) ? name : [name];
          return names.includes(field as Path<TFieldValues>);
        }

        return true;
      });

      //flatten error messages of selected/all fields
      return filteredFields.reduce<string[]>((result, [, error]) => {
        // check if prop is error object
        if (isErrorObject(error)) {
          const message = createErrorMessage(error);
          if (message) {
            result.push(message);
          }
        } else {
          // nested object or array
          if (Array.isArray(error)) {
            return error.reduce<string[]>(
              (result, err: FieldError) => flattenErrors(err, result),
              initial,
            );
          }
          return flattenErrors(error as FieldErrors, initial);
        }

        return result;
      }, initial);
    },
    [appendUnBoundFields, createErrorMessage, name],
  );

  /**
   * NOTE: errors object is not immutable (Proxy) so cant memoize the result
   */

  const result = disabled ? [] : flattenErrors(errors);
  return result;
}

export default useFormErrors;
