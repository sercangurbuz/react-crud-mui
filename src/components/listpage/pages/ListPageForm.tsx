import { useMemo } from 'react';
import { DefaultValues, FieldValues } from 'react-hook-form';

import merge from 'lodash.merge';
import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import useForm, { UseFormOptions, ValidationOptions } from '../../form/hooks/useForm';
import { DeepNullable } from '../../utils';
import ListPageData, { ListPageDataProps, ListPageFilter } from './ListPageData';

/* -------------------------------------------------------------------------- */
/*                                    TYpes                                   */
/* -------------------------------------------------------------------------- */

export interface ListPageFormProps<TModel extends FieldValues, TFilter extends FieldValues>
  extends ListPageDataProps<TModel, TFilter>,
    Partial<Pick<UseFormOptions<TFilter>, 'schema'>> {
  schema?: z.ZodType<Partial<TFilter>>;
  /**
   * Default form fields values
   */
  defaultValues?: DeepNullable<TFilter>;
  /**
   * Optional validation options
   */
  validationOptions?: ValidationOptions<ListPageFilter<TFilter>>;
}

function ListPageForm<TModel extends FieldValues, TFilter extends FieldValues>(
  props: ListPageFormProps<TModel, TFilter>,
) {
  const { schema, defaultValues, defaultFilter, validationOptions } = props;
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  const initialFilter = useMemo(() => {
    return defaultFilter
      ? (merge({}, defaultValues, defaultFilter) as ListPageFilter<TFilter>)
      : undefined;
  }, [defaultValues, defaultFilter]);

  const form = useForm<ListPageFilter<TFilter>>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema,
    defaultValues: defaultValues as DefaultValues<ListPageFilter<TFilter>>,
    resetOptions: {
      keepDefaultValues: true,
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
