import { Divider, DividerProps } from '@mui/material';

export type PageDividerProps = DividerProps;

function PageDivider(props: PageDividerProps) {
  return (
    <Divider
      sx={{
        my: 1,
      }}
      {...props}
    />
  );
}

export default PageDivider;
