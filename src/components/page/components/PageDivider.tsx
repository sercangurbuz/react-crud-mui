import { Divider, DividerProps } from '@mui/material';

interface PageDividerProps extends DividerProps {}

function PageDivider(props: PageDividerProps) {
  return (
    <Divider
      sx={{
        my: 3,
      }}
      {...props}
    />
  );
}

export default PageDivider;
