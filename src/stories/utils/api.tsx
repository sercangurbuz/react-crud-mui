import { useEffect, useState } from 'react';

import axios from 'axios';

import { DeletePayload, SavePayload } from '../../components/detail-page/pages/DetailPageData';
import { ListPageFilter } from '../../components/list-page/pages/ListPageFilter';
import { DeepNullable } from '../../components/utils';
import { ToDo } from '../detail-page/components/NestedTodosRouteTab';
import { UserSchema } from './schema';

export const UserDefaultValues: DeepNullable<UserSchema> = {
  id: null,
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  isActive: false,
  address: null,
};

export const handleSaveUser = async ({ model, reason }: SavePayload<UserSchema>) => {
  if (reason === 'create') {
    await axios.post<UserSchema>(`https://jsonplaceholder.typicode.com/users`, model);
  } else {
    await axios.put<UserSchema>(`https://jsonplaceholder.typicode.com/users/${model.id}`, model);
  }
};

export const handleDeleteUser = async ({ model }: DeletePayload<UserSchema>) => {
  await axios.delete<UserSchema>(`https://jsonplaceholder.typicode.com/users/${model.id}`);
};

export const useFetchUsers = (filter: ListPageFilter<UserSchema>) => {
  const [data, setdata] = useState<UserSchema[]>();
  const [loading, setloading] = useState<boolean>();

  useEffect(() => {
    if (filter) {
      const { name, username, email, website, phone, _meta } = filter;

      setloading(true);
      void fetch(
        `https://jsonplaceholder.typicode.com/users?${new URLSearchParams({
          name_like: name ? `^${name}` : '',
          username_like: username ? `^${username}` : '',
          email_like: email ? `^${email}` : '',
          website_like: website ? `^${website}` : '',
          phone_like: phone ? `^${phone}` : '',
          _page: String(_meta?.pagination.pageIndex ?? 1),
          _limit: String(_meta?.pagination?.pageSize),
          _sort: _meta.sorting.map(({ desc, id }) => `${desc ? '-' : ''}${id}`).join(),
        }).toString()}`,
      ).then(async (response) => {
        const data = (await response.json()) as UserSchema[];
        setdata(data);
        setloading(false);
      });
    }
  }, [filter]);

  return [data, loading] as const;
};

export const useFetchUserById = (id: string | number = 1) => {
  const [data, setdata] = useState<UserSchema>();
  const [loading, setloading] = useState<boolean>();

  useEffect(() => {
    if (id !== 'new') {
      setloading(true);
      void fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(async (response) => {
        const data = (await response.json()) as UserSchema;
        setdata(data);
        setloading(false);
      });
    }
  }, [id]);

  return [data, loading] as const;
};

export const useFetchTodosByUserId = (userId: string | number = 1, title: string = '') => {
  const [data, setdata] = useState<ToDo[]>();
  const [loading, setloading] = useState<boolean>();

  useEffect(() => {
    if (userId) {
      setloading(true);
      void fetch(
        `https://jsonplaceholder.typicode.com/todos?userId=${userId}${title ? `&title_like=^${title}` : ''}`,
      ).then(async (response) => {
        const data = (await response.json()) as ToDo[];
        setdata(data);
        setloading(false);
      });
    }
  }, [userId, title]);

  return [data, loading] as const;
};
