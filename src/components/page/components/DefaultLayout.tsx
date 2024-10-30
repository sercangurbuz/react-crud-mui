import { CSSProperties, ReactNode } from 'react';

import { Card, SxProps, Theme } from '@mui/material';

import { PaddingSize } from './PageProvider';

export type PageLayoutOptions = {
  size: PaddingSize;
  loading?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  sx?: SxProps<Theme>;
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
    <Card style={options?.style} sx={options?.sx}>
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
