import React, { useState, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { useTheme } from '@mui/material';
import type { BackdropProps } from '@mui/material/Backdrop';
import Backdrop from '@mui/material/Backdrop';

import SwitcherAutoComplete, { type SwitcherAutoCompleteProps } from './SwitcherAutoComplete';
import SwitcherLabel, { SwitcherLabelProps } from './SwitcherLabel';
import SwitcherPopper, { SwitcherPopperProps } from './SwitcherPopper';

export type SwitcherProps<TData> = {
  data: TData[];
  isLoading?: boolean;
  onDropdownVisibilityChange?: (open: boolean) => void;
  slots?: {
    label?: SwitcherLabelProps;
    popper?: SwitcherPopperProps;
    autocomplete?: SwitcherAutoCompleteProps<TData>;
    backdrop?: BackdropProps;
  };
} & PropsWithChildren;

function Switcher<TData>({
  data,
  children,
  isLoading,
  onDropdownVisibilityChange,
  slots,
}: SwitcherProps<TData>) {
  const theme = useTheme();
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onDropdownVisibilityChange?.(true);
  };
  const handleClose = () => {
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
    onDropdownVisibilityChange?.(false);
  };

  return (
    <>
      {createPortal(
        <Backdrop
          open={open}
          sx={{
            backdropFilter: 'blur(3px)',
            background: 'transparent',
            zIndex: theme.zIndex.drawer + 1,
          }}
          {...slots?.backdrop}
        />,
        document.body,
      )}

      <SwitcherLabel
        onClick={handleClick}
        open={open}
        {...slots?.label}
        data-site-switcher-open={open}
      >
        {children}
      </SwitcherLabel>
      <SwitcherPopper open={open} anchorEl={anchorEl} onClickAway={handleClose} {...slots?.popper}>
        <SwitcherAutoComplete
          loading={isLoading}
          data={data}
          onClose={handleClose}
          {...(slots?.autocomplete as SwitcherAutoCompleteProps<TData>)}
        />
      </SwitcherPopper>
    </>
  );
}

export default Switcher;
