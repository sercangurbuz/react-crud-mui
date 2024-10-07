import React from 'react';

import { FormComboBoxProps } from '../../../components/form/controls/FormComboBox';
import Field from '../../../components/form/Field';
import { useAppQuery } from '../../../components/query';
import { IdNameSchema } from '../../utils/schema';

interface UsersSelectProps extends Omit<FormComboBoxProps<IdNameSchema, false>, 'optionTemplate'> {}

function UserSelect(props: UsersSelectProps) {
  const { data, isFetching } = useAppQuery<IdNameSchema[]>({
    queryKey: ['users'],
    url: 'https://jsonplaceholder.typicode.com/users',
  });

  return (
    <Field.Combobox
      {...props}
      label="Selected User"
      optionTemplate="${name}"
      data={data}
      loading={isFetching}
    />
  );
}

export default UserSelect;
