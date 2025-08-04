import { Components } from '@mui/material/styles/components';
import { Theme } from '@mui/material/styles/createTheme';
import { alpha } from '@mui/system/colorManipulator';

// CUSTOM UTILS METHOD
import { isDark } from '../theme.constants';

export const Button = (theme: Theme): Components['MuiButton'] => {
  const { error, primary, text, success, warning, grey } = theme.palette;

  return {
    defaultProps: { variant: 'contained', color: 'primary' },
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: 10,
        color: 'inherit',
        boxShadow: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textTransform: 'none',
        textOverflow: 'ellipsis',
        '&.Mui-disabled': { color: grey[400] },
      },

      // contained variants
      contained: {
        color: 'white',
        ':hover': { boxShadow: 'none' },
        '&.Mui-disabled': {
          backgroundColor: grey[isDark(theme) ? 600 : 200],
        },
      },
      containedError: { ':hover': { backgroundColor: error[600] } },
      containedPrimary: { ':hover': { backgroundColor: primary[600] } },
      containedSuccess: { ':hover': { backgroundColor: success[700] } },
      containedWarning: { ':hover': { backgroundColor: warning[500] } },
      containedSecondary: {
        transition: 'none',
        color: text.primary,
        ':hover': { backgroundColor: grey[200] },
        ...(isDark(theme) && {
          backgroundColor: grey[700],
          ':hover': { backgroundColor: grey[600] },
        }),
      },
      containedInherit: {
        backgroundColor: text.primary,
        ':hover': { backgroundColor: alpha(text.primary, 0.9) },
        ...(isDark(theme) && { color: 'black' }),
      },

      // outlined variants
      outlinedError: { color: error.main },
      outlinedPrimary: { color: primary.main },
      outlinedSuccess: { color: success.main },
      outlinedWarning: { color: warning.main },
      outlinedSecondary: {
        transition: 'none',
        borderColor: grey[200],
        ...(isDark(theme) && { borderColor: grey[700] }),
      },

      // text variants
      textPrimary: { color: primary.main },
      textSecondary: { color: grey[600] },
      textSuccess: { color: success.main },
      textWarning: { color: warning.main },
      textError: { color: error.main },

      // sizes
      sizeSmall: { padding: '0.25rem .5rem', height: 30 },
      sizeMedium: { padding: '6px 14px' },
      sizeLarge: { padding: '8px 16px', height: 48 },
    },
  };
};

export const ButtonBase = (theme: Theme): Components['MuiButtonBase'] => {
  return {
    styleOverrides: {
      root: { fontFamily: theme.typography.fontFamily },
    },
  };
};

export const ButtonGroup = (theme: Theme): Components['MuiButtonGroup'] => {
  return {
    styleOverrides: {
      root: { boxShadow: 'none' },
      groupedContainedPrimary: {
        '&:not(:last-of-type):not(.Mui-disabled)': {
          borderColor: theme.palette.primary[600],
        },
      },
      groupedContained: ({ ownerState: { color } }) => ({
        ...(color === 'success' && {
          '&:not(:last-of-type):not(.Mui-disabled)': {
            borderColor: theme.palette.success[600],
          },
        }),

        ...(color === 'error' && {
          '&:not(:last-of-type):not(.Mui-disabled)': {
            borderColor: theme.palette.error[400],
          },
        }),

        ...(color === 'warning' && {
          '&:not(:last-of-type):not(.Mui-disabled)': {
            borderColor: theme.palette.warning[400],
          },
        }),
      }),

      groupedContainedSecondary: {
        backgroundColor: theme.palette.secondary[200],
        '&:not(:last-of-type):not(.Mui-disabled)': {
          borderColor: theme.palette.secondary[300],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.secondary[700],
        }),
        ':hover': {
          backgroundColor: theme.palette.secondary[300],
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.secondary[800],
          }),
        },
      },

      groupedOutlinedSecondary: {
        ':hover': {
          borderColor: theme.palette.secondary[200],
          backgroundColor: theme.palette.secondary[200],
          ...theme.applyStyles('dark', {
            borderColor: theme.palette.secondary[700],
            backgroundColor: theme.palette.secondary[800],
          }),
        },
      },

      groupedTextSecondary: {
        '&:not(:last-of-type):not(.Mui-disabled)': {
          borderColor: theme.palette.secondary[300],
        },
      },
    },
  };
};

export const IconButton = (theme: Theme): Components['MuiIconButton'] => {
  return {
    styleOverrides: {
      colorSecondary: {
        color: theme.palette.grey[400],
        ':hover': { color: theme.palette.primary.main },
      },
    },
  };
};

export const LoadingButton = (theme: Theme): Components['MuiLoadingButton'] => {
  return {
    defaultProps: { variant: 'contained' },

    styleOverrides: {
      root: {
        '.MuiLoadingButton-loadingIndicator': {
          color: theme.palette.grey[400],
        },
      },
    },
  };
};
