import React, { ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

import { Grid2, Grid2Props, Pagination, PaginationProps, Stack } from '@mui/material';

import ActionCommands, { ActionCommandsProps } from '../../action-commands/ActionCommands';
import useTranslation from '../../i18n/hooks/useTranslation';
import Page from '../../page/Page';
import EmptyText, { EmptyTextProps } from '../../table/components/EmptyText';

export interface CardListProps<TModel extends FieldValues> {
  data?: TModel[];
  onCardMeta: (
    model: TModel,
    actions: React.ReactNode,
    actionProps: ActionCommandsProps<TModel>,
  ) => ReactNode;
  onActionCommandProps: (model: TModel, index: number) => ActionCommandsProps<TModel>;
  cardColProps?: Grid2Props;
  cardRowProps?: Grid2Props;
  enablePagination?: boolean;
  paginationProps?: PaginationProps;
  emptyTextProps?: EmptyTextProps;
  enableActionCommands?: boolean;
}

function CardList<TModel extends FieldValues>({
  enableActionCommands,
  cardColProps,
  cardRowProps,
  data,
  enablePagination,
  onCardMeta,
  paginationProps,
  onActionCommandProps,
  emptyTextProps,
}: CardListProps<TModel>) {
  const { t } = useTranslation();
  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderCards = () => {
    const cardNodes = data?.map((model, index) => {
      const props = onActionCommandProps(model, index);
      const actions = enableActionCommands ? <ActionCommands {...props} /> : undefined;
      const cardNode = onCardMeta(model, actions, props);
      return (
        <Grid2 size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={index} {...cardColProps}>
          {cardNode}
        </Grid2>
      );
    });

    return cardNodes;
  };

  const cards = renderCards();

  if (!data?.length) {
    return <EmptyText emptyText={t('nodatafound')} sx={{ py: 2 }} {...emptyTextProps} />;
  }

  return (
    <Page.Content pt={0}>
      <Grid2 container spacing={2} {...cardRowProps}>
        {cards}
        {enablePagination ? (
          <Grid2 size={{ xs: 12 }}>
            <Stack alignItems="center" py={2}>
              <Pagination shape="rounded" {...paginationProps} />
            </Stack>
          </Grid2>
        ) : null}
      </Grid2>
    </Page.Content>
  );
}

export default CardList;
