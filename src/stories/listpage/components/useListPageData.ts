import { useCallback, useMemo } from 'react';

import { ListPageProps } from '../../../components/listpage/pages/ListPage';
import { ListPageMeta, PagingListModel } from '../../../components/listpage/pages/ListPageData';
import { useAppLazyQuery } from '../../../components/query';
import { UserSchema } from '../../utils/schema';

function useListPageData() {
  const { fetch, data, isPending, error, prevData } = useAppLazyQuery<UserSchema[]>({
    url: 'https://jsonplaceholder.typicode.com/users',
  });
  const users = useMemo<PagingListModel<UserSchema>>(
    () => ({
      data: data ?? prevData ?? [],
      dataCount: data || prevData ? 10 : 0,
    }),
    [data, prevData],
  );

  const handleNeedData = useCallback(
    ({ name, username, email, website, phone }: UserSchema, meta: ListPageMeta) =>
      fetch({
        name_like: name && `^${name}`,
        username_like: username && `^${username}`,
        email_like: email && `^${email}`,
        website_like: website && `^${website}`,
        phone_like: phone && `^${phone}`,
        _page: meta.pagination?.pageIndex + 1,
        _limit: meta.pagination?.pageSize,
        _sort: meta.sorting.map(({ desc, id }) => `${desc ? '-' : ''}${id}`).join(),
      }),
    [],
  );

  return {
    onNeedData: handleNeedData,
    loading: isPending,
    error,
    data: users,
  } as Partial<ListPageProps<UserSchema>>;
}

export default useListPageData;
