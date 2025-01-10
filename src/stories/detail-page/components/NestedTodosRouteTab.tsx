import { useState } from 'react';

import { CheckOutlined } from '@mui/icons-material';
import { z } from 'zod';

import DetailPage from '../../../components/detail-page';
import useDetailPageRouteParams from '../../../components/detail-page/hooks/useDetailPageRouteParams';
import { DetailPageModalProps } from '../../../components/detail-page/pages/DetailPageModal';
import { FlexBetween, FlexBox } from '../../../components/flexbox';
import Field from '../../../components/form/Field';
import UserOutlined from '../../../components/icons/UserOutlined';
import ListPage from '../../../components/list-page/pages/ListPage';
import Page from '../../../components/page/Page';
import { useFetchTodosByUserId } from '../../utils/api';

const todoSchema = z.object({
  title: z.string().nonempty(),
  id: z.number().optional(),
  userId: z.number().nullable(),
  completed: z.boolean(),
});

export type ToDo = z.infer<typeof todoSchema>;

function NestedTodosRouteTab() {
  const { id } = useDetailPageRouteParams();

  const [title, settitle] = useState<string>();
  const [data, loading] = useFetchTodosByUserId(id, title);

  return (
    <ListPage.Route
      onNeedData={(filter) => {
        settitle(filter?.keyword as string);
      }}
      data={data}
      defaultValues={{
        keyword: '',
      }}
      loading={loading}
      filterContent={
        <Page.Content>
          <Field.Search name="keyword" sx={{ maxWidth: 400, width: '100%' }} />
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
      onDetailPage={(props) => <EmbeddedPage {...(props as DetailPageModalProps<ToDo>)} />}
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

function EmbeddedPage(props: DetailPageModalProps<ToDo>) {
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
      schema={todoSchema}
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
