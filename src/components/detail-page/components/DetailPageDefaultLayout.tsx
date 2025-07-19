import { ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

import { NeedDataReason } from '../pages/DetailPageContent';

export type DetailPageLayoutOptions<TModel extends FieldValues = FieldValues> = {
  loading?: boolean;
  reason: NeedDataReason;
  data?: TModel;
};

export type DetailPageLayoutProps<TModel extends FieldValues = FieldValues> = {
  content?: ReactNode;
  stepsContent?: ReactNode;
  autoSaveContent?: ReactNode;
  options: DetailPageLayoutOptions<TModel>;
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
