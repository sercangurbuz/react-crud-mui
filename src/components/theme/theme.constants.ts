import { Theme } from '@mui/material/styles/createTheme';

export const THEMES = { LIGHT: 'light', DARK: 'dark' };

export const isDark = (theme: Theme) => theme.palette.mode === 'dark';
