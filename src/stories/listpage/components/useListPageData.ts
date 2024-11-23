import { useCallback, useMemo, useState } from 'react';

import { ListPageProps } from '../../../components/list-page/pages/ListPage';
import {
  ListPageFilter,
  ListPageMeta,
  PagingListModel,
} from '../../../components/list-page/pages/ListPageFilter';
import { useFetchUsers } from '../../utils/api';
import { UserSchema } from '../../utils/schema';

function useListPageData() {
  const [filter, setfilter] = useState<ListPageFilter<UserSchema>>();
  const [data, loading] = useFetchUsers(filter!);

  const users = useMemo<PagingListModel<UserSchema>>(
    () => ({
      data: data ?? [],
      dataCount: data ? 10 : 0,
    }),
    [data],
  );

  const handleNeedData = useCallback(
    (filter: UserSchema, _meta: ListPageMeta) => setfilter({ ...filter, _meta }),
    [],
  );

  return {
    onNeedData: handleNeedData,
    loading,
    data: users,
  } as Partial<ListPageProps<UserSchema>>;
}

export default useListPageData;
