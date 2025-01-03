import { FieldValues, UseFormProps } from 'react-hook-form';

import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import { useForm } from '../../form/hooks';
import { UseFormReturn, ValidationOptions } from '../../form/hooks/useForm';
import { DeepNullable } from '../../utils';
import TriggerValidation from '../components/TriggerValidation';
import DetailPageData, { DetailPageDataProps } from './DetailPageData';

export interface DetailPageFormProps<TModel extends FieldValues>
  extends Omit<DetailPageDataProps<TModel>, 'form' | 'defaultValues' | 'schema'> {
  form?: UseFormReturn<TModel>;
  schema?: z.ZodType<TModel>;
  defaultValues?: DeepNullable<TModel> | (() => Promise<DeepNullable<TModel>>);
  validationOptions?: ValidationOptions<TModel>;
}

function DetailPageForm<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  schema,
  defaultValues,
  validationOptions,
  data,
  ...dpProps
}: DetailPageFormProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  const form = useForm<TModel>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema,
    defaultValues: defaultValues as UseFormProps<TModel>['defaultValues'],
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
      />
      <TriggerValidation />
    </FormProvider>
  );
}

export default DetailPageForm;
