import { useState } from 'react';

import { ListPageProps } from '../../../components/list-page/pages/ListPage';
import { ListPageMeta } from '../../../components/list-page/pages/ListPageFilter';
import { useFetchUsers } from '../../utils/api';
import { UserSchema } from '../../utils/schema';

function useListPageData() {
  const [{ filter, meta }, setfilter] = useState<{ filter?: UserSchema; meta?: ListPageMeta }>({
    filter: undefined,
    meta: undefined,
  });
  const [data, loading] = useFetchUsers(filter!, meta!);

  const handleNeedData = (filter: UserSchema, meta: ListPageMeta) => setfilter({ filter, meta });

  return {
    onNeedData: handleNeedData,
    loading,
    data,
    // jsonplaceholder returns 10 rows total
    dataCount: data ? 10 : 0,
  } as Partial<ListPageProps<UserSchema>>;
}

export default useListPageData;
