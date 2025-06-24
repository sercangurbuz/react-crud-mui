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
  valuesChangeContent?: ReactNode;
  errorsContent?: ReactNode;
  options: DetailPageLayoutOptions;
};

type DetailPageDefaultLayoutProps = DetailPageLayoutProps;

function DetailPageDefaultLayout({
  content,
  stepsContent,
  autoSaveContent,
  valuesChangeContent,
  errorsContent,
}: DetailPageDefaultLayoutProps) {
  return (
    <>
      {content}
      {errorsContent}
      {stepsContent}
      {autoSaveContent}
      {valuesChangeContent}
    </>
  );
}

export default DetailPageDefaultLayout;
