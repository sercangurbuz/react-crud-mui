import { Components } from '@mui/material/styles/components';
import { Theme } from '@mui/material/styles/createTheme';

import { isDark } from '../theme.constants';

// CUSTOM UTILS METHOD

export const Accordion = (theme: Theme): Components['MuiAccordion'] => {
  const { grey, primary } = theme.palette;

  return {
    defaultProps: { elevation: 0, disableGutters: true },
    styleOverrides: {
      root: {
        overflow: 'hidden',
        marginBottom: '1rem',
        border: `1px solid ${grey[isDark(theme) ? 700 : 300]}`,
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        ':before': { display: 'none' },
        ':last-of-type': { marginBottom: 0 },
      },

      rounded: { borderRadius: '1rem !important' },
    },

    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          borderLeftWidth: 3,
          '.MuiAccordionDetails-root': { paddingTop: '1rem' },
          '&.Mui-expanded': {
            borderColor: primary.main,
            '.MuiAccordionSummary-root': {
              color: primary.main,
              backgroundColor: grey[isDark(theme) ? 900 : 50],
            },
            '.MuiAccordionSummary-expandIconWrapper': {
              color: primary.main,
            },
          },
        },
      },
    ],
  };
};

export const AccordionDetails = (theme: Theme) => ({
  styleOverrides: {
    root: {
      fontSize: 14,
      fontWeight: 400,
      /* paddingTop: 0,
      paddingInline: 0,
      paddingBottom: 0, */
      padding: 0,
      color: theme.palette.grey[400],
    },
  },
});

export const AccordionSummery = (theme: Theme) => ({
  styleOverrides: {
    root: {
      fontSize: 14,
      fontWeight: 600,
      padding: '0 16px ',
      color: theme.palette.grey[400],
      transition: `all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
      '&.Mui-expanded': {
        color: theme.palette.grey[isDark(theme) ? 100 : 700],
      },
    },
    content: {},
    expandIconWrapper: { color: theme.palette.grey[400] },
  },
});
