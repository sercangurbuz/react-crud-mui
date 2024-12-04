import { DefaultValues, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import FormProvider from '../../form/components/FormProvider';
import useForm, {
  UseFormOptions,
  UseFormReturn,
  ValidationOptions,
} from '../../form/hooks/useForm';
import { DeepNullable } from '../../utils';
import ListPageFilter, { ListPageFilterProps } from './ListPageFilter';

/* -------------------------------------------------------------------------- */
/*                                    TYpes                                   */
/* -------------------------------------------------------------------------- */

export interface ListPageFormProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends Omit<ListPageFilterProps<TModel, TFilter, TDetailPageModel>, 'form'>,
    Partial<Pick<UseFormOptions<TFilter>, 'schema'>> {
  form?: UseFormReturn<TFilter>;
  schema?: z.ZodType<Partial<TFilter>>;
  /**
   * External filter criteries
   */
  defaultFilter?: Partial<TFilter>;
  /**
   * Default form fields values
   */
  defaultValues?: DeepNullable<TFilter>;
  /**
   * Optional validation options
   */
  validationOptions?: ValidationOptions<TFilter>;
}

/**
 * ListPage with form features for filter criterias
 */
function ListPageForm<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>(props: ListPageFormProps<TModel, TFilter, TDetailPageModel>) {
  const { schema, defaultValues, defaultFilter, validationOptions } = props;
  /* -------------------------------------------------------------------------- */
  /*                                 Form hooks                                 */
  /* -------------------------------------------------------------------------- */

  const form = useForm<TFilter>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    schema,
    defaultValues: defaultValues as DefaultValues<TFilter>,
    resetOptions: {
      keepDefaultValues: true,
      keepDirty: true,
    },
    values: defaultFilter as unknown as TFilter,
  });

  const formMethods = props.form ?? form;

  return (
    <FormProvider form={formMethods} validationOptions={validationOptions}>
      <ListPageFilter {...props} form={formMethods} />
    </FormProvider>
  );
}

export default ListPageForm;
