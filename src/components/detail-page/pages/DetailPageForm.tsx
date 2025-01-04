import { FieldValues } from 'react-hook-form';

import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import { useForm } from '../../form/hooks';
import { UseFormReturn, ValidationOptions } from '../../form/hooks/useForm';
import { isPromise } from '../../misc/isPromise';
import TriggerValidation from '../components/TriggerValidation';
import DetailPageData, { DetailPageDataProps } from './DetailPageData';

export interface DetailPageFormProps<TModel extends FieldValues>
  extends Omit<DetailPageDataProps<TModel>, 'form' | 'schema'> {
  form?: UseFormReturn<TModel>;
  schema?: z.ZodType<TModel>;
  validationOptions?: ValidationOptions<TModel>;
}

function DetailPageForm<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  schema,
  defaultValues,
  validationOptions,
  data,
  reason,
  ...dpProps
}: DetailPageFormProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  const form = useForm<TModel>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema,
    defaultValues: () => {
      const values = typeof defaultValues === 'function' ? defaultValues?.(reason!) : defaultValues;

      if (isPromise(values)) {
        return values as Promise<TModel>;
      }

      return Promise.resolve(values as TModel);
    },
    values: data,
  });

  const formMethods = dpProps.form ?? form;

  return (
    <FormProvider<TModel> form={formMethods} validationOptions={validationOptions}>
      <DetailPageData<TModel>
        {...dpProps}
        activeSegmentIndex={activeSegmentIndex}
        form={formMethods}
        data={data}
        reason={reason}
        defaultValues={defaultValues}
      />
      <TriggerValidation />
    </FormProvider>
  );
}

export default DetailPageForm;
