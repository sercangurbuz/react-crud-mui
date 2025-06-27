import { PropsWithChildren } from 'react';
import { DefaultValues, FieldValues, Path, useFormState, useWatch } from 'react-hook-form';

import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import { useFormInitEffect } from '../../form/hooks';
import useForm from '../../form/hooks/useForm';
import useRegisterForm from '../../form/hooks/useRegisterForm';

interface DetailPageStepContentProps<TModel extends FieldValues> {
  schema?: z.ZodType<TModel>;
  defaultValues?: DefaultValues<TModel>;
  name: Path<TModel>;
}

/**
 * This component is used to create a form for each step in the detail page.
 */
function DetailPageStepContentWrapper<TModel extends FieldValues>({
  schema,
  name,
  children,
  defaultValues,
}: DetailPageStepContentProps<TModel> & PropsWithChildren) {
  /**
   * Get model slice from parent model schema
   */
  const stepModel = useWatch({ name });
  const { defaultValues: parentDefaultValues } = useFormState();

  /**
   *  Create form for the current step
   */
  const form = useForm<TModel>({
    schema,
    values: stepModel,
    defaultValues: (defaultValues ??
      (parentDefaultValues ? parentDefaultValues[name] : null)) as DefaultValues<TModel>,
  });

  /**
   * Register the form as a child in the form collection so tha main form can access it
   */
  useRegisterForm({ name, form });

  /**
   * Besure to trigger the form validation when the component is mounted
   */
  useFormInitEffect(() => {
    void form.trigger();
  });

  return <FormProvider form={form}>{children}</FormProvider>;
}

export default DetailPageStepContentWrapper;
