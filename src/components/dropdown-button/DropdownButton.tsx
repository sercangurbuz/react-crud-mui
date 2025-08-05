import React, { useRef, useState } from 'react';

import {
  Button,
  ButtonGroup,
  ButtonProps,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons';

import { Tiny } from '../typography';

export interface DropdownButtonProps extends ButtonProps {
  options: DropdownOption[];
  buttonGroupProps?: React.ComponentProps<typeof ButtonGroup>;
}

export type DropdownOption = {
  label: string;
  icon?: React.ReactNode;
  value: string;
  helperText?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
};

function DropdownButton({
  options,
  disabled,
  size,
  buttonGroupProps,
  color,
  variant = 'contained',
  ...buttonProps
}: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant={variant}
        ref={anchorRef}
        disabled={disabled}
        size={size}
        color={color}
        {...buttonGroupProps}
      >
        <Button {...buttonProps} />
        <Button
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
          sx={{ px: size === 'small' ? 0.5 : 0.7, minWidth: '20px !important;' }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id="split-button-menu"
                  autoFocusItem
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  {options.map((option) => (
                    <MenuItem
                      key={option.value}
                      disabled={option.disabled}
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpen(false);
                        option.onClick?.(event);
                      }}
                    >
                      {option.icon ? (
                        <ListItemIcon sx={{ color: 'inherit' }}>{option.icon}</ListItemIcon>
                      ) : null}
                      <ListItemText disableTypography>
                        {option.label}
                        {option.helperText ? (
                          <Tiny fontSize={12} color="text.secondary">
                            {option.helperText}
                          </Tiny>
                        ) : null}
                      </ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default DropdownButton;
