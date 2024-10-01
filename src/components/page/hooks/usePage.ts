import { useContext } from 'react';

import { PageContext, PageProviderProps } from '../components/PageProvider';

function usePage() {
  const props = useContext(PageContext) as PageProviderProps;
  return props;
}

export default usePage;
