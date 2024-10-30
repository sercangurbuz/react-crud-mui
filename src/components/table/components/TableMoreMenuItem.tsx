// MUI ICON COMPONENT TYPE
import { SvgIconComponent } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

// ==============================================================
interface TableMoreMenuItemProps {
  title: string;
  Icon: SvgIconComponent;
  handleClick?: () => void;
  disabled?: boolean;
}
// ==============================================================

export default function TableMoreMenuItem(props: TableMoreMenuItemProps) {
  const { disabled, Icon, title, handleClick } = props;

  return (
    <MenuItem onClick={handleClick} disabled={disabled}>
      <ListItemIcon>
        <Icon fontSize="small" color="inherit" />
      </ListItemIcon>

      <ListItemText disableTypography>{title}</ListItemText>
    </MenuItem>
  );
}
