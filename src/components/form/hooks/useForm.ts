import { useCallback } from 'react';
import {
  FieldPath,
  FieldValues,
  UseFormReturn as ReactHookFormUseFormReturn,
  UseFormProps,
  useForm as useRHF,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
};

export interface UseFormOptions<TFieldValues extends FieldValues>
  extends UseFormProps<TFieldValues> {
  schema?: z.ZodType<Partial<TFieldValues>>;
}

export interface UseFormReturn<TFieldValues extends FieldValues>
  extends ReactHookFormUseFormReturn<TFieldValues> {
  /**
   * Shortcut method for handleSubmit()()
   * @returns Returns form model when validation successed
   */
  getFormModel(): Promise<TFieldValues>;
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

  // RHF useForm hook
  const formMethods = useRHF<TFieldValues>({
    resolver: schema && zodResolver(schema),
    ...options,
  });

  const { handleSubmit } = formMethods;

  const getFormModel = useCallback((): Promise<TFieldValues> => {
    return new Promise<TFieldValues>((resolve, reject) => {
      handleSubmit(resolve, reject)();
    });
  }, [handleSubmit]);

  return {
    ...formMethods,
    getFormModel,
  } as UseFormReturn<TFieldValues>;
}

export default useForm;
