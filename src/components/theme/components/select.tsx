import { Components, Theme } from '@mui/material';

import { isDark } from '../theme.constants';

export const Select = (theme: Theme): Components['MuiSelect'] => ({
  styleOverrides: {
    // The rendered value inside the Select
    select: {
      '&.Mui-disabled': {
        color: theme.palette.grey[500],
        WebkitTextFillColor: theme.palette.grey[500], // Safari
      },
    },
    // The chevron icon
    icon: {
      '.Mui-disabled &': {
        color: theme.palette.grey[400],
      },
    },
  },
});

// Strengthen it for outlined variant (since you already override OutlinedInput)
export const OutlinedInput = (theme: Theme): Components['MuiOutlinedInput'] => ({
  styleOverrides: {
    root: {
      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.grey[isDark(theme) ? 600 : 300],
        },
        // Ensure Select text color is disabled when using OutlinedInput
        '.MuiSelect-select': {
          color: theme.palette.text.disabled,
          WebkitTextFillColor: theme.palette.text.disabled,
        },
      },
    },
    // ...existing code...
    input: {
      color: theme.palette.text.primary,
    },
    // ...existing code...
  },
});
