import { useWatch } from 'react-hook-form';

import { FormSelectProps } from '../../../components/form/controls/FormSelect';
import Field from '../../../components/form/Field';
import { useAppQuery } from '../../../components/query';
import { UserSchema } from '../../utils/schema';

interface UsersSelectProps extends Omit<FormSelectProps<UserSchema>, 'optionTemplate'> {}

function UsersSelect(props: UsersSelectProps) {
  const { data } = useAppQuery<UserSchema[]>({
    queryKey: ['users'],
    url: 'https://jsonplaceholder.typicode.com/users',
  });

  const selUserId = useWatch({ name: 'selUserId' });

  console.log('selUserId', selUserId);

  return (
    <Field.Select
      {...props}
      optionTemplate="${name}"
      //displayTemplate="${name}"
      label="Selected"
      data={data}
    />
  );
}

export default UsersSelect;
