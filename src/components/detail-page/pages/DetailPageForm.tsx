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
  defaultValues?: DeepNullable<TModel> | DeepNullable<TModel>[];
  /**
   * Optional validation options
   */
  validationOptions?: ValidationOptions<TModel>;
}

function DetailPageForm<TModel extends FieldValues>(props: DetailPageFormProps<TModel>) {
  const { activeSegmentIndex = 0, schema, defaultValues, validationOptions } = props;
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * get default values depending on segment index when using in steps mode
   */
  const initialValues = Array.isArray(defaultValues)
    ? defaultValues[activeSegmentIndex]
    : defaultValues;

  // array schema only used in steps
  const formSchema = Array.isArray(schema) ? schema[activeSegmentIndex] : schema;

  const form = useForm<TModel>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema: formSchema,
    defaultValues: initialValues as DefaultValues<TModel>,
  });

  const formMethods = props.form ?? form;

  return (
    <FormProvider<TModel> form={formMethods} validationOptions={validationOptions}>
      <DetailPageData<TModel>
        {...props}
        form={formMethods}
        defaultValues={initialValues}
        schema={formSchema}
      />
    </FormProvider>
  );
}

export default DetailPageForm;
