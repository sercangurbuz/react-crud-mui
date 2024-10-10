import axios from 'axios';

import { DeletePayload, SavePayload } from '../../components/detail-page/pages/DetailPageData';
import { DeepNullable } from '../../components/utils';
import { UserSchema } from './schema';

export const UserDefaultValues: DeepNullable<UserSchema> = {
  id: null,
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  isActive: false,
};

export const handleSaveUser = async ({ model, reason }: SavePayload<UserSchema>) => {
  if (reason === 'create') {
    await axios.post<UserSchema>(`https://jsonplaceholder.typicode.com/users`, model);
  } else {
    await axios.put<UserSchema>(`https://jsonplaceholder.typicode.com/users/${model.id}`, model);
  }
};

export const handleDeleteUser = async ({ model, reason }: DeletePayload<UserSchema>) => {
  await axios.delete<UserSchema>(`https://jsonplaceholder.typicode.com/users/${model.id}`);
};
