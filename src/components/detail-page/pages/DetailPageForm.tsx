import { DefaultValues, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import { useForm } from '../../form/hooks';
import { UseFormReturn, ValidationOptions } from '../../form/hooks/useForm';
import { DeepNullable } from '../../utils';
import DetailPageData, { DetailPageDataProps } from './DetailPageData';

export interface DetailPageFormProps<TModel extends FieldValues>
  extends Omit<DetailPageDataProps<TModel>, 'form' | 'defaultValues' | 'schema'> {
  form?: UseFormReturn<TModel>;
  schema?: z.ZodType<Partial<TModel>> | z.ZodType<Partial<TModel>>[];
  defaultValues?: DeepNullable<TModel>;
  /**
   * Optional validation options
   */
  validationOptions?: ValidationOptions<TModel>;
}

function DetailPageForm<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  schema,
  defaultValues,
  validationOptions,
  ...dpProps
}: DetailPageFormProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  // array schema only used in steps
  const formSchema = Array.isArray(schema) ? schema[activeSegmentIndex] : schema;

  const form = useForm<TModel>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema: formSchema,
    defaultValues: defaultValues as DefaultValues<TModel>,
  });

  const formMethods = dpProps.form ?? form;

  return (
    <FormProvider<TModel> form={formMethods} validationOptions={validationOptions}>
      <DetailPageData<TModel>
        {...dpProps}
        activeSegmentIndex={activeSegmentIndex}
        form={formMethods}
        defaultValues={defaultValues}
        schema={formSchema}
      />
    </FormProvider>
  );
}

export default DetailPageForm;
