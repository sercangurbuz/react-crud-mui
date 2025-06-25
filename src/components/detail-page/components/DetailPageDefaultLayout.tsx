import { ReactNode } from 'react';

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

type DetailPageDefaultLayoutProps = DetailPageLayoutProps;

function DetailPageDefaultLayout({
  content,
  stepsContent,
  autoSaveContent,
}: DetailPageDefaultLayoutProps) {
  return (
    <>
      {content}
      {stepsContent}
      {autoSaveContent}
    </>
  );
}

export default DetailPageDefaultLayout;
