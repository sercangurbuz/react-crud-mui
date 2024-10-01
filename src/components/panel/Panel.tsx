import { Card, Divider } from '@mui/material';

import Header, { HeaderProps } from '../header/Header';

interface PanelProps extends HeaderProps {
  bordered?: boolean;
}

function Panel({ bordered = true, children, ...headerProps }: PanelProps) {
  return (
    <Card>
      <Header {...headerProps} />
      {bordered ? <Divider /> : null}
      {children}
    </Card>
  );
}

export default Panel;
Panel.Header = Header;
