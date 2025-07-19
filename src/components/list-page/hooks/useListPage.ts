import { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { ListPageContext, ListPageContextType } from '../components/ListPageProvider';

const useListPage = <TModel extends FieldValues>() => {
  const injectedProps = useContext(ListPageContext);
  return injectedProps as ListPageContextType<TModel>;
};

export default useListPage;
