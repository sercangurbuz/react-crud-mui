import { useContext } from 'react';

import { PageContext } from '../components/PageProvider';

function usePage() {
  const props = useContext(PageContext);
  return props;
}

export default usePage;
