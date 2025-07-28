import { useCallback, useMemo } from 'react';
import {
  FieldPath,
  FieldValues,
  UseFormReturn as ReactHookFormUseFormReturn,
  useFormContext,
  UseFormProps,
  useForm as useRHF,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { isDev } from '../../misc/isDev';

export type ValidationCallOutType = 'tooltip' | 'label' | 'none';
export type ValidationVisibilityOptions =
  | 'selected-fields'
  | 'only-unbound-fields'
  | 'all'
  | 'invisible';

export type CallOutVisibilityOptions = 'selected-fields' | 'all' | 'invisible';

export type ValidationOptions<TFieldValues extends FieldValues = FieldValues> = {
  alertVisibility?: ValidationVisibilityOptions;
  callOutVisibility?: CallOutVisibilityOptions;
  fields?: FieldPath<TFieldValues>[];
  runValidationsOnDataChange?: boolean;
};

export interface UseFormOptions<TFieldValues extends FieldValues>
  extends UseFormProps<TFieldValues> {
  schema?: z.ZodType<Partial<TFieldValues>>;
}

export interface UseFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TParentFieldValues extends FieldValues = FieldValues,
> extends ReactHookFormUseFormReturn<TFieldValues> {
  /**
   * Shortcut method for handleSubmit()()
   * @returns Returns form model when validation successed
   */
  getFormModel(): Promise<TFieldValues>;
  /**
   * Possible parent form if this form is a child of another form
   */
  parentForm?: UseFormReturn<TParentFieldValues>;
}

/**
 * Wrapper RHF useForm hook
 */
function useForm<TFieldValues extends FieldValues = FieldValues>({
  schema,
  ...options
}: UseFormOptions<TFieldValues> = {}) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const parentForm = useFormContext() as UseFormReturn<TFieldValues> | undefined;

  // RHF useForm hook
  const formMethods = useRHF<TFieldValues>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    resolver: schema && zodResolver(schema),
    ...options,
  });

  const { handleSubmit } = formMethods;

  const getFormModel = useCallback((): Promise<TFieldValues> => {
    return new Promise<TFieldValues>((resolve, reject) => {
      void handleSubmit(resolve, (err) => {
        reject(new Error('Form validation error'));

        if (isDev()) {
          console.error('Form validation error: ', err);
        }
      })();
    });
  }, [handleSubmit]);

  const returnValue = useMemo(
    () => Object.assign(formMethods, { getFormModel, parentForm }),
    [formMethods, getFormModel, parentForm],
  );

  return returnValue as UseFormReturn<TFieldValues>;
}

export default useForm;
