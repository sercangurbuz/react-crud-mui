/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckCircle from '@mui/icons-material/CheckCircle';
import Error from '@mui/icons-material/Error';
// MUI ICON COMPONENTS
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import { Components, PaletteColor, Theme } from '@mui/material/styles';

import { isDark } from '../theme.constants';

// CUSTOM UTILS METHOD

const standardStyle = (color: PaletteColor) => ({
  color: color.main,
  backgroundColor: color[50],
});

const outlinedStyle = (color: PaletteColor, theme: Theme) => ({
  color: isDark(theme) ? color[50] : color,
  borderColor: color.main,
  backgroundColor: isDark(theme) ? color[900] : color[50],
});

const actionBtnStyle = (primary: string, secondary: string) => ({
  '& .btn-group button': {
    ':first-of-type': {
      border: `1px solid ${secondary}`,
      marginRight: '1rem',
    },
    ':last-of-type': { backgroundColor: secondary, color: primary },
  },
});

const Alert = (theme: Theme): Components['MuiAlert'] => {
  const { primary, success, error, warning, common, grey } = theme.palette;

  return {
    defaultProps: {
      iconMapping: {
        info: <Info />,
        error: <Error />,
        success: <CheckCircle />,
        warning: <Warning />,
      },
    },
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontSize: 12,
        fontWeight: 600,
        alignItems: 'center',
      },
      standardError: standardStyle(error),
      standardSuccess: standardStyle(success),
      standardWarning: standardStyle(warning),
      standardInfo: {
        ...standardStyle(primary),
        '& .MuiAlert-icon': { color: primary.main },
      },

      outlinedError: outlinedStyle(error, theme) as any,
      outlinedSuccess: outlinedStyle(success, theme) as any,
      outlinedWarning: outlinedStyle(warning, theme) as any,
      outlinedInfo: {
        ...outlinedStyle(primary, theme),
        '& .MuiAlert-icon': { color: primary.main },
        ...(isDark(theme) && { backgroundColor: grey[700] }),
      } as any,

      filledWarning: { color: common.white },
      filledSuccess: {
        color: common.white,
        backgroundColor: success[600],
      },
      filledInfo: { color: common.white, backgroundColor: primary.main },

      action: ({ ownerState: { severity, variant } }) => ({
        ':has( > .btn-group)': {
          padding: 0,
          '& button': {
            borderRadius: 10,
            padding: '.5rem 1rem',
            fontWeight: 600,
          },
        },

        ...(severity === 'info' && {
          ...(variant === 'filled' && actionBtnStyle(primary.main, common.white)),
          ...(variant === 'outlined' && actionBtnStyle(common.white, primary.main)),
          ...(variant === 'standard' && actionBtnStyle(common.white, primary.main)),
        }),
        ...(severity === 'error' && {
          ...(variant === 'filled' && actionBtnStyle(error.main, common.white)),
          ...(variant === 'outlined' && actionBtnStyle(common.white, error.main)),
          ...(variant === 'standard' && actionBtnStyle(common.white, error.main)),
        }),
        ...(severity === 'success' && {
          ...(variant === 'filled' && actionBtnStyle(success.main, common.white)),
          ...(variant === 'outlined' && actionBtnStyle(common.white, success.main)),
          ...(variant === 'standard' && actionBtnStyle(common.white, success.main)),
        }),
        ...(severity === 'warning' && {
          ...(variant === 'filled' && actionBtnStyle(warning.main, common.white)),
          ...(variant === 'outlined' && actionBtnStyle(common.white, warning.main)),
          ...(variant === 'standard' && actionBtnStyle(common.white, warning.main)),
        }),
      }),
    },
  };
};

export default Alert;
