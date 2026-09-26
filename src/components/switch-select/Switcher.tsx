import React, { useState, type PropsWithChildren } from 'react';

import SwitcherAutoComplete, { type SwitcherAutoCompleteProps } from './SwitcherAutoComplete';
import SwitcherLabel from './SwitcherLabel';
import SwitcherPopper from './SwitcherPopper';

export type SwitcherProps<TData> = {
  data: TData[];
  isLoading?: boolean;
  onRenderOption: (props: React.HTMLAttributes<HTMLLIElement>, data: TData) => React.ReactNode;
  onNavigate: (data: TData) => void;
  onDropdownVisibilityChange?: (open: boolean) => void;
  onSearch?: SwitcherAutoCompleteProps<TData>['filterOptions'];
  placeholder?: string;
} & PropsWithChildren;

function Switcher<TData>({
  data,
  children,
  isLoading,
  onRenderOption,
  onNavigate,
  onDropdownVisibilityChange,
  onSearch,
  placeholder,
}: SwitcherProps<TData>) {
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
      <SwitcherLabel onClick={handleClick} open={open}>
        {children}
      </SwitcherLabel>
      <SwitcherPopper open={open} anchorEl={anchorEl} onClickAway={handleClose}>
        <SwitcherAutoComplete
          loading={isLoading}
          data={data}
          onClose={handleClose}
          onChange={(_event, newValue) => onNavigate(newValue!)}
          onRender={onRenderOption}
          filterOptions={onSearch}
          placeholder={placeholder}
        />
      </SwitcherPopper>
    </>
  );
}

export default Switcher;
