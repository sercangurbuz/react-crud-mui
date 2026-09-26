import { type PropsWithChildren } from 'react';

import { type PopperProps } from '@mui/material';
import Box from '@mui/material/Box';
import ClickAwayListener, { type ClickAwayListenerProps } from '@mui/material/ClickAwayListener';

import { StyledPopper } from './styled';

interface SwitcherPopperProps extends PopperProps, Pick<ClickAwayListenerProps, 'onClickAway'> {}

function SwitcherPopper({
  onClickAway,
  children,
  open,
  ...popperProps
}: PropsWithChildren<SwitcherPopperProps>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const id = open ? 'current-label' : undefined;

  return (
    <StyledPopper {...popperProps} open={open} id={id} placement="bottom-start">
      <ClickAwayListener onClickAway={onClickAway}>
        <Box pt={3}>{children}</Box>
      </ClickAwayListener>
    </StyledPopper>
  );
}

export default SwitcherPopper;
