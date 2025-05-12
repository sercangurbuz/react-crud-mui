import { FieldValues } from 'react-hook-form';

import SearchInput, { SearchInputProps } from '../../search-input/SearchInput';
import Field, { ControlCommonProps } from '../Field';

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SearchInputProps, 'name' | 'onSearch'>,
    ControlCommonProps<TFieldValues> {}

function FormSearchInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={({ onChange, ...field }, { invalid }) => (
        <SearchInput {...inputProps} {...field} error={invalid} onSearch={onChange} />
      )}
      {...fieldProps}
    />
  );
}

export default FormSearchInput;
