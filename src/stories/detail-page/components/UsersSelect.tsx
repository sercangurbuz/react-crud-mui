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

  return (
    <Field.Select {...props} optionTemplate="${name}" data={data} />
  );
}

export default UsersSelect;
