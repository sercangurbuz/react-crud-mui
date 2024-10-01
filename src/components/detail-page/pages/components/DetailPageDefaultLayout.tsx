import { ReactNode } from 'react';

import { LinearProgress } from '@mui/material';

import { NeedDataReason } from '../DetailPageContent';

export type DetailPageLayoutOptions = {
  loading?: boolean;
  reason: NeedDataReason;
};

export type DetailPageLayoutProps = {
  content?: ReactNode;
  autoSaveContent?: ReactNode;
  options: DetailPageLayoutOptions;
};

interface DetailPageDefaultLayoutProps extends DetailPageLayoutProps {}

function DetailPageDefaultLayout({
  content,
  autoSaveContent,
  options: { loading },
}: DetailPageDefaultLayoutProps) {
  return (
    <>
      <LinearProgress style={{ visibility: loading ? 'visible' : 'hidden' }} />
      {content}
      {autoSaveContent}
    </>
  );
}

export default DetailPageDefaultLayout;
