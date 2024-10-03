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
};

function DefaultLayout({
  content,
  pageHeader,
  footerContent,
  alertsContent,
  options,
}: PageLayoutProps) {
  return (
    <Card style={options?.style}>
      {pageHeader}
      {alertsContent}
      {content}
      {footerContent}
    </Card>
  );
}

export default DefaultLayout;
