import Card from '@mui/material/Card';

import Modal from '../../modal';
import { ListPageLayoutProps } from './ListPageDefaultLayout';

function ListPageModalLayout({
  filterContent,
  tableContent,
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
}: ListPageLayoutProps) {
  return (
    <Card style={options?.style} sx={options?.sx}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      {tabsHeaderContent}
      {stickyContent}
      <Modal.Scroll autoHide={false}>
        {content}
        {tabsContent}
        {panelsContent}
        {filterContent}
        {moreContent}
        {tableContent}
      </Modal.Scroll>
      {footerContent}
    </Card>
  );
}

export default ListPageModalLayout;
