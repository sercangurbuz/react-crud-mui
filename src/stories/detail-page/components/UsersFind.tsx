import React from 'react';

import { FormComboBoxProps } from '../../../components/form/controls/FormComboBox';
import Field from '../../../components/form/Field';
import { useAppQuery } from '../../../components/query';
import { IdNameSchema, UserSchema } from '../../utils/schema';

interface UserFindProps extends Omit<FormComboBoxProps<UserSchema, false>, 'optionTemplate'> {}

function UserFind(props: UserFindProps) {
  const { data, isFetching } = useAppQuery<UserSchema[]>({
    queryKey: ['users'],
    url: 'https://jsonplaceholder.typicode.com/users',
  });

  return (
    <Field.Combobox
      {...props}
      label="Selected User"
      optionTemplate="${name}"
      descriptionTemplate="${email}"
      data={data}
      displayTemplate={(model) => `${model.name} - ${model.email}`}
      loading={isFetching}
    />
  );
}

export default UserFind;
