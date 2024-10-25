import { useMemo } from 'react';
import { DefaultValues, FieldValues } from 'react-hook-form';

import merge from 'lodash.merge';
import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import useForm, { UseFormOptions, ValidationOptions } from '../../form/hooks/useForm';
import { DeepNullable } from '../../utils';
import ListPageData, { ListPageDataProps } from './ListPageData';

/* -------------------------------------------------------------------------- */
/*                                    TYpes                                   */
/* -------------------------------------------------------------------------- */

export interface ListPageFormProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends ListPageDataProps<TModel, TFilter>,
    Partial<Pick<UseFormOptions<TFilter>, 'schema'>> {
  schema?: z.ZodType<Partial<TFilter>>;
  /**
   * Default form fields values
   */
  defaultValues?: DeepNullable<TFilter>;
  /**
   * Optional validation options
   */
  validationOptions?: ValidationOptions<TFilter>;
}

function ListPageForm<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>(
  props: ListPageFormProps<TModel, TFilter>,
) {
  const { schema, defaultValues, defaultFilter, validationOptions } = props;
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  const initialFilter = useMemo(() => {
    return defaultFilter ? (merge({}, defaultValues, defaultFilter) as TFilter) : undefined;
  }, [defaultValues, defaultFilter]);

  const form = useForm<TFilter>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema,
    defaultValues: defaultValues as DefaultValues<TFilter>,
    resetOptions: {
      keepDefaultValues: true,
      keepDirty: true,
    },
    values: initialFilter,
  });

  const formMethods = props.form ?? form;

  return (
    <FormProvider form={formMethods} validationOptions={validationOptions}>
      <ListPageData {...props} form={formMethods} />
    </FormProvider>
  );
}

export default ListPageForm;
