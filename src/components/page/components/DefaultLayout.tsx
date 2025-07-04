import { CSSProperties, ReactNode } from 'react';

import Card from '@mui/material/Card';
import type { SxProps, Theme } from '@mui/material/styles';

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
  tabsHeaderContent?: ReactNode;
  panelsContent?: ReactNode;
  progressContent?: ReactNode;
  moreContent?: ReactNode;
};

function DefaultLayout({
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
}: PageLayoutProps) {
  return (
    <Card style={options?.style} sx={options?.sx}>
      {pageHeader}
      {progressContent}
      {alertsContent}
      {tabsHeaderContent}
      {content}
      {tabsContent}
      {panelsContent}
      {moreContent}
      {footerContent}
    </Card>
  );
}

export default DefaultLayout;
