import { useEffect } from 'react';
import { DefaultValues, FieldValues, UseFormProps } from 'react-hook-form';

import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import { useForm } from '../../form/hooks';
import { UseFormReturn, ValidationOptions } from '../../form/hooks/useForm';
import { usePrevious } from '../../hooks';
import { isPromise } from '../../misc/isPromise';
import { DeepNullable } from '../../utils';
import TriggerValidation from '../components/TriggerValidation';
import { NeedDataReason } from './DetailPageContent';
import DetailPageData, { DetailPageDataProps } from './DetailPageData';

export type DefaultDataFn<TModel extends FieldValues> = (
  reason: NeedDataReason,
  data?: TModel,
) => DeepNullable<TModel> | Promise<DeepNullable<TModel>>;
export type DefaultData<TModel extends FieldValues> = DeepNullable<TModel> | DefaultDataFn<TModel>;

export interface DetailPageFormProps<TModel extends FieldValues>
  extends Omit<DetailPageDataProps<TModel>, 'form'> {
  form?: UseFormReturn<TModel>;
  schema?: z.ZodType<TModel>;
  validationOptions?: ValidationOptions<TModel>;
  defaultValues?: DefaultData<TModel>;
  formProps?: Partial<UseFormProps<TModel>>;
}

function DetailPageForm<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  schema,
  defaultValues,
  validationOptions,
  data,
  reason,
  formProps,
  ...dpProps
}: DetailPageFormProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  const form = useForm<TModel>({
    schema,
    defaultValues:
      typeof defaultValues === 'function'
        ? () => {
            const values = defaultValues?.(reason!);

            if (isPromise(values)) {
              return values as Promise<TModel>;
            }

            return Promise.resolve(values as TModel);
          }
        : (defaultValues as DefaultValues<TModel>),
    values: data,
    ...formProps,
  });

  const formMethods = dpProps.form ?? form;

  const prevReason = usePrevious(reason);
  const { reset } = formMethods;

  useEffect(() => {
    if (reason === 'create' && prevReason !== 'create') {
      const values =
        typeof defaultValues === 'function' ? defaultValues?.(reason, data) : defaultValues;
      reset(values as TModel);
    }
  }, [data, defaultValues, prevReason, reason, reset]);

  return (
    <FormProvider<TModel> form={formMethods} validationOptions={validationOptions}>
      <DetailPageData<TModel>
        {...dpProps}
        activeSegmentIndex={activeSegmentIndex}
        form={formMethods}
        data={data}
        reason={reason}
      />
      <TriggerValidation />
    </FormProvider>
  );
}

export default DetailPageForm;
