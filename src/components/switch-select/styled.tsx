import { autocompleteClasses, darken, InputBase, lighten, Popper, styled } from '@mui/material';

interface PopperComponentProps {
  anchorEl?: unknown;
  disablePortal?: boolean;
  open: boolean;
}

export const StyledAutocompletePopper = styled('div')(({ theme }) => ({
  width: '400px !important',
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: 'none',
    margin: 0,
    fontSize: 13,
    borderRadius: 0,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
    },
    [`& .${autocompleteClasses.groupLabel}`]: {
      fontWeight: 600,
      color: theme.palette.text.primary,
      backgroundColor: lighten(theme.palette.primary.main, 0.7),
      ...theme.applyStyles('dark', {
        backgroundColor: darken(theme.palette.primary.main, 0.5),
      }),
    },
  },
}));

export function PopperComponent(props: PopperComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disablePortal, anchorEl, open, ...other } = props;
  return <StyledAutocompletePopper {...other} />;
}

export const StyledPopper = styled(Popper)(({ theme, open }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  borderTopLeftRadius: open ? 0 : undefined,
  overflow: 'hidden',
  zIndex: theme.zIndex.modal + 1,
  fontSize: 13,
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
  height: 45,
  fontSize: 13,
  width: '100%',
  paddingInline: 16,
  borderRadius: '50px',
  color: theme.palette.text.primary,
  border: 'none',
  backgroundColor: theme.palette.background.default,
}));
