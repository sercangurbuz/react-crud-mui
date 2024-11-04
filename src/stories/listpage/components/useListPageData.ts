import { useCallback, useMemo } from 'react';

import { ListPageProps } from '../../../components/list-page/pages/ListPage';
import { ListPageFilter, PagingListModel } from '../../../components/list-page/pages/ListPageFilter';
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
    ({ name, username, email, website, phone, _meta }: ListPageFilter<UserSchema>) =>
      fetch({
        name_like: name && `^${name}`,
        username_like: username && `^${username}`,
        email_like: email && `^${email}`,
        website_like: website && `^${website}`,
        phone_like: phone && `^${phone}`,
        _page: _meta.pagination.pageIndex + 1,
        _limit: _meta.pagination?.pageSize,
        _sort: _meta.sorting.map(({ desc, id }) => `${desc ? '-' : ''}${id}`).join(),
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
