import { CSSProperties, ReactNode } from 'react';

import { Card } from '@mui/material';

import { PaddingSize } from './PageProvider';

export type PageLayoutOptions = {
  size: PaddingSize;
  loading?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
};

export type PageLayoutProps = {
  pageHeader?: React.ReactNode;
  commandsContent?: React.ReactNode;
  content: React.ReactNode;
  footerContent?: React.ReactNode;
  alertsContent?: ReactNode;
  options: PageLayoutOptions;
  tabsContent?: ReactNode;
  progressContent?: ReactNode;
};

function DefaultLayout({
  alertsContent,
  content,
  footerContent,
  progressContent,
  options,
  pageHeader,
  tabsContent,
}: PageLayoutProps) {
  return (
    <Card style={options?.style}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      {content}
      {tabsContent}
      {footerContent}
    </Card>
  );
}

export default DefaultLayout;
