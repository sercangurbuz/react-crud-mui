import { ReactNode } from 'react';

import { LinearProgress, styled } from '@mui/material';

import { NeedDataReason } from '../pages/DetailPageContent';

export type DetailPageLayoutOptions = {
  loading?: boolean;
  reason: NeedDataReason;
};

export type DetailPageLayoutProps = {
  content?: ReactNode;
  stepsContent?: ReactNode;
  autoSaveContent?: ReactNode;
  options: DetailPageLayoutOptions;
};

interface DetailPageDefaultLayoutProps extends DetailPageLayoutProps {}

function DetailPageDefaultLayout({
  content,
  stepsContent,
  autoSaveContent,
}: DetailPageDefaultLayoutProps) {
  return (
    <>
      {stepsContent}
      {content}
      {autoSaveContent}
    </>
  );
}

export default DetailPageDefaultLayout;
