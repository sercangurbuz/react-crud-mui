import getSettings, { Settings } from './settings';
import React from 'react';

const defaultSettings = getSettings();
const context = React.createContext<Settings>(defaultSettings);

export default context;
