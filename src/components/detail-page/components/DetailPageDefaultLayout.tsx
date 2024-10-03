import { ReactNode } from 'react';

import { LinearProgress, styled } from '@mui/material';

import { NeedDataReason } from '../pages/DetailPageContent';

export type DetailPageLayoutOptions = {
  loading?: boolean;
  reason: NeedDataReason;
};

export type DetailPageLayoutProps = {
  content?: ReactNode;
  autoSaveContent?: ReactNode;
  options: DetailPageLayoutOptions;
};

const LoadingProgress = styled(LinearProgress)(({ theme }) => ({
  height: 1.5,
  borderRadius: 0,
  marginBottom: theme.spacing(2),
}));

interface DetailPageDefaultLayoutProps extends DetailPageLayoutProps {}

function DetailPageDefaultLayout({
  content,
  autoSaveContent,
  options: { loading },
}: DetailPageDefaultLayoutProps) {
  return (
    <>
      <LoadingProgress style={{ visibility: loading ? 'visible' : 'hidden' }} />
      {content}
      {autoSaveContent}
    </>
  );
}

export default DetailPageDefaultLayout;
