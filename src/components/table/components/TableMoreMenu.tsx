import { Fragment, MouseEvent, PropsWithChildren, ReactNode } from 'react';

// MUI ICON COMPONENT
import MoreVert from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
// MUI
import Menu from '@mui/material/Menu';

// ==============================================================
interface TableMoreMenuProps extends PropsWithChildren {
  open: HTMLElement | null;
  handleClose: () => void;
  handleOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  moreIcon?: ReactNode;
}
// ==============================================================

export default function TableMoreMenu(props: TableMoreMenuProps) {
  const { moreIcon, disabled, open, children, handleClose, handleOpen } = props;

  return (
    <Fragment>
      <IconButton color="secondary" onClick={handleOpen} disabled={disabled}>
        {moreIcon ?? <MoreVert fontSize="small" />}
      </IconButton>

      <Menu
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        {children}
      </Menu>
    </Fragment>
  );
}
