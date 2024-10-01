import { Theme } from '@mui/material/styles/createTheme'
import { Components } from '@mui/material/styles/components'
// CUSTOM UTILS METHOD
import { isDark } from '../theme.constants';

export const TablePagination = (theme: Theme): Components['MuiTablePagination'] => {
  return {
    styleOverrides: {
      select: { ':focus': { borderRadius: 8 } },
      actions: { color: theme.palette.grey[600] },
      menuItem: { marginInline: 8, borderRadius: 8, justifyContent: 'center' },
    },
  }
}

export const Pagination = (): Components['MuiPagination'] => ({
  defaultProps: { color: 'primary', size: 'medium' },
})

export const PaginationItem = (theme: Theme): Components['MuiPaginationItem'] => {
  const { primary, grey } = theme.palette

  return {
    styleOverrides: {
      rounded: { borderRadius: 8 },

      icon: ({ ownerState: { color } }) => ({
        ...(color === 'primary' && { color: primary.main }),
        ...(color === 'secondary' && { color: grey[700] }),
        ...(color === 'standard' && { color: grey[600] }),
      }),

      ellipsis: { border: 0 },

      text: ({ ownerState: { color } }) => ({
        color: grey[400],
        border: `1px solid ${grey[isDark(theme) ? 700 : 200]}`,

        '&.Mui-selected': {
          border: 0,
          ...(color === 'standard' && {
            color: grey[500],
            backgroundColor: grey[200],
            ':hover': { backgroundColor: grey[200] },
          }),
        },
      }),

      textSecondary: {
        '&.Mui-selected': {
          color: 'white',
          backgroundColor: grey[700],
          ':hover': { backgroundColor: grey[700] },
        },
      },

      outlined: ({ ownerState: { color } }) => ({
        color: grey[400],
        border: `1px solid ${grey[isDark(theme) ? 700 : 200]}`,
        ...(color === 'standard' && {
          '&.Mui-selected': {
            color: grey[700],
            borderColor: grey[200],
            backgroundColor: grey[100],
            ':hover': { backgroundColor: grey[100] },
          },
        }),
      }),

      outlinedSecondary: {
        '&.Mui-selected': {
          color: grey[700],
          borderColor: grey[300],
          backgroundColor: grey[200],
          ':hover': { backgroundColor: grey[300] },
        },
      },
    },
  }
}
