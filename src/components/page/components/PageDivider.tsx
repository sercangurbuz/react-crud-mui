import { Divider, DividerProps } from '@mui/material';

export type PageDividerProps = DividerProps;

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
