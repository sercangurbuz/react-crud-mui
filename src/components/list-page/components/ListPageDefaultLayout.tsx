import { ReactNode } from 'react';

import Card from '@mui/material/Card';

import { PageLayoutProps } from '../../page/components/DefaultLayout';

export type ListPageLayoutProps = PageLayoutProps & {
  filterContent: ReactNode;
  tableContent: ReactNode;
};

function ListPageDefaultLayout({
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
  tabsContent,
  tabsHeaderContent,
}: ListPageLayoutProps) {
  return (
    <Card style={options?.style} sx={options?.sx}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      {tabsHeaderContent}
      {content}
      {tabsContent}
      {panelsContent}
      {filterContent}
      {moreContent}
      {tableContent}
      {footerContent}
    </Card>
  );
}

export default ListPageDefaultLayout;
