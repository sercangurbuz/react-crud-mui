import { useCallback, useRef } from 'react';
import {
  FieldPath,
  FieldValues,
  UseFormReturn as ReactHookFormUseFormReturn,
  UseFormProps,
  useForm as useRHF,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { DeepNullable } from '../../utils';

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

export interface UseFormReturn<TFieldValues extends FieldValues>
  extends ReactHookFormUseFormReturn<TFieldValues> {
  /**
   * Shortcut method for handleSubmit()()
   * @returns Returns form model when validation successed
   */
  getFormModel(): Promise<TFieldValues>;
  /**
   * Initial defaultValues of form
   */
  initialValues: DeepNullable<TFieldValues>;
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

  const initialValuesRef = useRef<DeepNullable<TFieldValues> | null>(null);

  // RHF useForm hook
  const formMethods = useRHF<TFieldValues>({
    resolver: schema && zodResolver(schema),
    ...options,
  });

  const {
    handleSubmit,
    formState: { defaultValues },
  } = formMethods;

  if (defaultValues && !initialValuesRef.current) {
    initialValuesRef.current = defaultValues as DeepNullable<TFieldValues>;
  }

  const getFormModel = useCallback((): Promise<TFieldValues> => {
    return new Promise<TFieldValues>((resolve, reject) => {
      void handleSubmit(resolve, reject)();
    });
  }, [handleSubmit]);

  return {
    ...formMethods,
    getFormModel,
    initialValues: initialValuesRef.current,
  } as UseFormReturn<TFieldValues>;
}

export default useForm;
