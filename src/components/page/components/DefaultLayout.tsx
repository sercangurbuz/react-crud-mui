import { ReactNode } from 'react';

import { Card } from '@mui/material';

import { PaddingSize } from './PageProvider';

export type PageLayoutOptions = {
  size: PaddingSize;
  loading?: boolean;
  disabled?: boolean;
};

export type PageLayoutProps = {
  pageHeader?: React.ReactNode;
  commandsContent?: React.ReactNode;
  content: React.ReactNode;
  footerContent?: React.ReactNode;
  alertsContent?: ReactNode;
  options: PageLayoutOptions;
};

function DefaultLayout({ content, pageHeader, footerContent, alertsContent }: PageLayoutProps) {
  return (
    <Card>
      {pageHeader}
      {alertsContent}
      {content}
      {footerContent}
    </Card>
  );
}

export default DefaultLayout;
