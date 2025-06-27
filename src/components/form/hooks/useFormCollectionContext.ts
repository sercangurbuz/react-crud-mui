import { useContext } from 'react';

import {
  FormCollectionContext,
  FormCollectionContextType,
} from '../components/FormCollectionProvider';

function useFormCollectionContext() {
  const settings = useContext(FormCollectionContext) as Required<FormCollectionContextType>;
  return settings;
}

export default useFormCollectionContext;
