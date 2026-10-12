import React from 'react';

import { Settings } from './settings';

type SettingsContextType = Settings & { setSettings: (settings: Partial<Settings>) => void };

const context = React.createContext<SettingsContextType | null>(null);

export default context;
