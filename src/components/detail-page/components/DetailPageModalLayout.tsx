import Card from '@mui/material/Card';

import Modal from '../../modal';
import { PageLayoutProps } from '../../page/components/DefaultLayout';

function DetailPageModalLayout({
  options,
  content,
  alertsContent,
  footerContent,
  moreContent,
  pageHeader,
  panelsContent,
  progressContent,
  stickyContent,
  tabsContent,
  tabsHeaderContent,
}: PageLayoutProps) {
  return (
    <Card style={options?.style} sx={options?.sx}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      {stickyContent}
      {tabsHeaderContent}
      <Modal.Scroll autoHide={false}>
        {content}
        {tabsContent}
        {panelsContent}
        {moreContent}
      </Modal.Scroll>
      {footerContent}
    </Card>
  );
}

export default DetailPageModalLayout;
