import React, { Fragment, MouseEvent, ReactNode } from 'react';

import MoreVert from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';

export interface TableMoreMenuProps extends Omit<MenuProps, 'open'> {
  open: HTMLElement | null;
  handleClose: () => void;
  handleOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  moreIcon?: ReactNode;
}

export default function TableMoreMenu(props: TableMoreMenuProps) {
  const { moreIcon, disabled, open, children, handleClose, handleOpen, ...rest } = props;

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleOpen(event);
  };

  return (
    <Fragment>
      <IconButton color="secondary" onClick={handleIconClick} disabled={disabled}>
        {moreIcon ?? <MoreVert fontSize="small" />}
      </IconButton>

      <Menu
        anchorEl={open}
        open={Boolean(open)}
        onClose={(e) => {
          (e as React.SyntheticEvent).stopPropagation();
          handleClose();
        }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
        {...rest}
      >
        {children}
      </Menu>
    </Fragment>
  );
}
