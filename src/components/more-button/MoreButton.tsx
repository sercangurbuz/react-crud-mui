import { Key, ReactNode, useState } from 'react';

import type { SvgIconComponent } from '@mui/icons-material';
import MoreVert from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import type { IconButtonProps } from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { StyledIconButton } from './styles';

export type MoreButtonItem = {
  icon?: ReactNode;
  children?: ReactNode;
  key: Key;
  danger?: boolean;
  divider?: boolean;
  onClick?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

export interface MoreButtonProps extends IconButtonProps {
  options?: MoreButtonItem[];
  Icon?: SvgIconComponent;
  renderOptions?: (func: () => void) => ReactNode;
}

export default function MoreButton({
  size = 'large',
  Icon = MoreVert,
  options,
  renderOptions,
  ...props
}: MoreButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <StyledIconButton
        size={size}
        aria-label="more"
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        {...props}
      >
        <Icon fontSize="small" />
      </StyledIconButton>

      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        TransitionComponent={Fade}
      >
        {renderOptions
          ? renderOptions(handleClose)
          : options?.map(({ children, key, danger, icon, onClick, divider }) =>
              divider ? (
                <Divider key={key} />
              ) : (
                <MenuItem
                  key={key}
                  onClick={(e) => {
                    onClick?.(e);
                    handleClose();
                  }}
                  sx={{
                    color: danger ? 'error.main' : null,
                    '& .MuiSvgIcon-root': {
                      color: danger ? 'error.main' : null,
                    },
                  }}
                >
                  {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                  {children}
                </MenuItem>
              ),
            )}
      </Menu>
    </div>
  );
}
