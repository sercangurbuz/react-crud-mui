import { useContext } from 'react';

import SettingsContext from '../SettingsContext';

export default () => {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error('useSettings must be used within a CrudMuiProvider');
  }

  return settings;
};
