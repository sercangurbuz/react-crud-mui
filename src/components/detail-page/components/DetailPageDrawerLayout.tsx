import { Box, Card } from '@mui/material';

import { PageLayoutProps } from '../../page/components/DefaultLayout';
import Scrollbar from '../../scrollbar';

function DetailPageDrawerLayout({
  alertsContent,
  content,
  panelsContent,
  footerContent,
  progressContent,
  options,
  pageHeader,
  moreContent,
  stickyContent,
  tabsContent,
  tabsHeaderContent,
}: PageLayoutProps) {
  return (
    <Card style={options?.style} sx={options?.sx}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      {tabsHeaderContent}
      {stickyContent}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Scrollbar
          style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' }}
          autoHide={false}
        >
          {content}
          {tabsContent}
        </Scrollbar>
      </Box>
      {panelsContent}
      {moreContent}
      {footerContent}
    </Card>
  );
}

export default DetailPageDrawerLayout;
