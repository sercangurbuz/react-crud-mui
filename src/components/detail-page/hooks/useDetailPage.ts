import { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { DetailPageContext, DetailPageContextType } from '../components/DetailPageProvider';

const useDetailPage = <TModel extends FieldValues = FieldValues>() => {
  const contextValues = useContext(DetailPageContext) as DetailPageContextType<TModel>;
  return contextValues;
};

export default useDetailPage;
