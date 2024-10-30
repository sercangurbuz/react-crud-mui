import { IconButton, IconButtonProps, useTheme } from '@mui/material';

type RoundedIconButtonProps = IconButtonProps;

function RoundedIconButton(props: RoundedIconButtonProps) {
  const theme = useTheme();
  return (
    <IconButton
      {...props}
      sx={{
        border: '1px solid',
        borderRadius: '10px',
        borderColor: 'grey[600]',
        '&:hover': { backgroundColor: theme.palette.action.hover },
        ...props.sx,
      }}
    />
  );
}

export default RoundedIconButton;
