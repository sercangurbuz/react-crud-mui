import { useContext } from 'react';

import SettingsContext from '../SettingsContext';

export default () => {
  const settings = useContext(SettingsContext);
  return settings;
};
