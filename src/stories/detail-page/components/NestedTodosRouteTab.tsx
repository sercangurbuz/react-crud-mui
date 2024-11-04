import { useMemo } from 'react';

import { CheckOutlined, Search } from '@mui/icons-material';
import { Grid2 } from '@mui/material';
import { z } from 'zod';

import DetailPage from '../../../components/detail-page';
import useDetailPageRouteParams from '../../../components/detail-page/hooks/useDetailPageRouteParams';
import { FlexBetween, FlexBox } from '../../../components/flexbox';
import Field from '../../../components/form/Field';
import UserOutlined from '../../../components/icons/UserOutlined';
import ListPage from '../../../components/list-page/pages/ListPage';
import { ListPageFilter, ListPageModel } from '../../../components/list-page/pages/ListPageFilter';
import Page from '../../../components/page/Page';
import { useAppLazyQuery } from '../../../components/query';
import { ServerError } from '../../../components/utils';

export type ToDo = {
  id?: number;
  title: string;
  completed: boolean;
};

function NestedTodosRouteTab() {
  const { id } = useDetailPageRouteParams();

  const { fetch, data, isPending, error, prevData } = useAppLazyQuery<
    ToDo[],
    ListPageFilter<{ userId: string }>
  >({
    variables: { userId: id },
    url: `https://jsonplaceholder.typicode.com/todos`,
  });

  const pagingData = useMemo<ListPageModel<ToDo>>(
    () => ({
      data: data ?? prevData ?? [],
      dataCount: data?.length ?? 0,
    }),
    [data, prevData],
  );

  return (
    <ListPage.Route
      onNeedData={(filter) => {
        fetch({
          title_like: filter?.keyword && `^${filter?.keyword}`,
        } as any);
      }}
      data={pagingData}
      defaultValues={{
        keyword: '',
      }}
      loading={isPending}
      error={error as ServerError}
      filterContent={
        <Page.Content>
          <Field.Input
            name="keyword"
            placeholder="Search..."
            InputProps={{ startAdornment: <Search /> }}
            sx={{ maxWidth: 400, width: '100%' }}
          />
        </Page.Content>
      }
      columns={[
        {
          header: 'Title',
          accessorKey: 'title',
        },
        {
          header: 'Completed',
          align: 'center',
          accessorKey: 'completed',
          cell(cell) {
            return cell.getValue() ? <CheckOutlined /> : null;
          },
        },
      ]}
      header="User Details"
      icon={<UserOutlined />}
      enableActionCommands
      enableSearch={false}
      enableClear={false}
      enableCreateItem
      detailPage={EmbeddedPage}
      enableNestedSegments
      tabs={[
        {
          label: 'Person Info',
          key: 'info',
          value: 'info',
        },
        {
          label: 'Additional Info',
          key: 'todos',
          value: 'todos',
        },
      ]}
    />
  );
}

function EmbeddedPage(props: any) {
  return (
    <DetailPage.Modal
      header="Todo's"
      enableDelete={false}
      defaultValues={{
        title: '',
        id: 0,
        userId: null,
        completed: false,
      }}
      createCommandLabel="New Todo"
      schema={z.object({
        title: z.string().nonempty(),
        id: z.number().optional(),
        userId: z.number().nullable(),
        completed: z.boolean(),
      })}
      onCommands={(props) => (
        <FlexBetween sx={{ width: '100%' }}>
          <Field.Checkbox name="completed" label="Completed ?" />
          <FlexBox gap={1}>{props.content}</FlexBox>
        </FlexBetween>
      )}
      {...props}
    >
      <Page.Content>
        <Field.Input name="title" label="Todo's title" />
      </Page.Content>
    </DetailPage.Modal>
  );
}

export default NestedTodosRouteTab;
