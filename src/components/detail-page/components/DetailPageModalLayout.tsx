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
  tabsContent,
  tabsHeaderContent,
}: PageLayoutProps) {
  return (
    <Card style={options?.style} sx={options?.sx}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      <Modal.Scroll autoHide={false}>
        {content}
        {tabsHeaderContent}
        {tabsContent}
        {panelsContent}
        {moreContent}
      </Modal.Scroll>
      {footerContent}
    </Card>
  );
}

export default DetailPageModalLayout;
