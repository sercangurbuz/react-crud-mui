import React, { ReactNode, useEffect, useRef } from 'react';
import { FieldValues } from 'react-hook-form';

import { BoxProps, Grid2, Grid2Props, Pagination, PaginationProps, Stack } from '@mui/material';

import ActionCommands, { ActionCommandsProps } from '../../action-commands/ActionCommands';
import useTranslation from '../../i18n/hooks/useTranslation';
import Page from '../../page/Page';
import EmptyText, { EmptyTextProps } from '../../table/components/EmptyText';

export interface CardListProps<TModel extends FieldValues> {
  data?: TModel[];
  enableSkeleton?: boolean;
  onCardMeta: (
    model: TModel,
    actions: React.ReactNode,
    actionProps: ActionCommandsProps<TModel>,
  ) => ReactNode;
  onCardSkeleton?: () => ReactNode;
  onActionCommandProps: (model: TModel, index: number) => ActionCommandsProps<TModel>;
  cardColProps?: Grid2Props;
  cardRowProps?: Grid2Props;
  cardWrapperProps?: BoxProps;
  enablePagination?: boolean;
  loading?: boolean;
  paginationProps?: PaginationProps;
  emptyTextProps?: EmptyTextProps;
  enableActionCommands?: boolean;
  showEmptyText?: boolean;
  skeletonRows?: number;
}

const DEFAULT_SKELETON_ROW_NUMBER = 12;

function CardList<TModel extends FieldValues>({
  cardColProps,
  cardRowProps,
  cardWrapperProps,
  data,
  emptyTextProps,
  enableActionCommands,
  enablePagination,
  onActionCommandProps,
  onCardMeta,
  onCardSkeleton,
  loading,
  enableSkeleton = true,
  paginationProps,
  skeletonRows = DEFAULT_SKELETON_ROW_NUMBER,
  showEmptyText = true,
}: CardListProps<TModel>) {
  const { t } = useTranslation();
  const firstLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (data?.length) {
      //for skeleton render
      firstLoadRef.current = false;
    }
  }, [data]);
  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderCardSkeletons = (rowsNum: number) => {
    if (!enableSkeleton || !loading || !firstLoadRef.current) {
      return null;
    }

    const cardNodes = [...Array(rowsNum)].map((_, index) => {
      const cardNode = onCardSkeleton?.();
      return (
        <Grid2 size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={index} {...cardColProps}>
          {cardNode}
        </Grid2>
      );
    });

    return cardNodes;
  };

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
  const skeletons = renderCardSkeletons(skeletonRows);

  if (!data?.length && showEmptyText && !loading) {
    return <EmptyText emptyText={t('nodatafound')} sx={{ py: 2 }} {...emptyTextProps} />;
  }

  return (
    <Page.Content pt={0} {...cardWrapperProps}>
      <Grid2 container spacing={2} {...cardRowProps}>
        {skeletons}
        {cards}
        {enablePagination && !loading ? (
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
