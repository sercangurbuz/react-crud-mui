// MUI ICON COMPONENT TYPE
import { SvgIconComponent } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

// ==============================================================
export interface TableMoreMenuItemProps extends MenuItemProps {
  title: string;
  Icon: SvgIconComponent;
  handleClick?: () => void;
  disabled?: boolean;
}
// ==============================================================

export default function TableMoreMenuItem(props: TableMoreMenuItemProps) {
  const { disabled, Icon, title, handleClick, ...rest } = props;

  return (
    <MenuItem onClick={handleClick} disabled={disabled} {...rest}>
      <ListItemIcon sx={{ color: 'inherit' }}>
        <Icon fontSize="small" />
      </ListItemIcon>

      <ListItemText disableTypography>{title}</ListItemText>
    </MenuItem>
  );
}
