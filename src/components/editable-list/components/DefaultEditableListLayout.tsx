import { ReactNode } from 'react';
import { FieldArrayPath, FieldValues, UseFieldArrayReturn } from 'react-hook-form';

import { UNIQUE_IDENTIFIER_FIELD_NAME } from '../../form/hooks';
import Header, { HeaderProps } from '../../header/Header';
import { Small } from '../../typography';

export interface DefaultEditableListControlLayoutProps<
  TModel extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> {
  commandsContent: ReactNode;
  tableContent: ReactNode;
  detailPageContent: ReactNode;
  errors?: string[];
  rowCount?: number;
  api: UseFieldArrayReturn<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME>;
  headerProps?: HeaderProps;
}

function DefaultEditableListLayout<
  TModel extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
>({
  commandsContent,
  detailPageContent,
  headerProps,
  tableContent,
  errors,
}: DefaultEditableListControlLayoutProps<TModel, TFieldArrayName>) {
  return (
    <>
      <Header {...headerProps} sx={{ pb: 1 }} rightContent={commandsContent} />
      {tableContent}
      {errors?.map((error, index) => (
        <Small key={index} color="text.secondary">
          {error}
        </Small>
      ))}
      {detailPageContent}
    </>
  );
}

export default DefaultEditableListLayout;
