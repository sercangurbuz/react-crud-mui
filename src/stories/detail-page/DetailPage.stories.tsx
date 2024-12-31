/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';
import {
  createMemoryRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { Assignment, Done, Pending } from '@mui/icons-material';
import { Button, Grid2 } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import DetailPage from '../../components/detail-page';
import useDetailPageRouteParams from '../../components/detail-page/hooks/useDetailPageRouteParams';
import { FlexBetween, FlexBox } from '../../components/flexbox';
import Field from '../../components/form/Field';
import { useZodRefine } from '../../components/hooks';
import Add from '../../components/icons/Add';
import Edit from '../../components/icons/Edit';
import GroupSenior from '../../components/icons/GroupSenior';
import User from '../../components/icons/User';
import Page from '../../components/page/Page';
import { H2 } from '../../components/typography';
import { ServerError } from '../../components/utils';
import mockData from '../../test-setup/mockUsers.json';
import {
  handleDeleteUser,
  handleSaveUser,
  useFetchUserById,
  UserDefaultValues,
} from '../utils/api';
import { userSchema, type UserSchema } from '../utils/schema';
import CustomCommands from './components/CustomCommands';
import CustomStepCommands from './components/CustomStepCommands';
import CustomTabs from './components/CustomTabs';
import CustomTitle from './components/CustomTitle';
import DisableStateButtons from './components/DisableStateButtons';
import FormContent from './components/FormContent';
import NestedTodosRouteTab from './components/NestedTodosRouteTab';
import NestedUserInfoRouteTab from './components/NestedUserInfoRouteTab';
import { Step1, Step2, Step3 } from './components/Steps';
import UserList from './components/UserList';

const meta: Meta<typeof DetailPage<UserSchema>> = {
  title: 'Components/DetailPage',
  component: DetailPage,
  args: {
    header: 'User Details',
    helperText: 'Type in user settings',
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
    children: <FormContent />,
    defaultReason: 'create',
    enableDelete: true,
    onSave: handleSaveUser,
    onDelete: handleDeleteUser,
    createCommandLabel: 'New User',
    defaultValues: UserDefaultValues,
    schema: userSchema,
  },
};

export default meta;
type DetailPageStory = StoryObj<typeof DetailPage<UserSchema>>;
type DetailPageModalStory = StoryObj<typeof DetailPage.Modal<UserSchema>>;
type DetailPageRouteStory = StoryObj<typeof DetailPage.Route<UserSchema>>;
type DetailPagePopoverStory = StoryObj<typeof DetailPage.Popover<UserSchema>>;

export const Simple: DetailPageStory = {};

export const LoadingState: DetailPageStory = {
  args: {
    loading: true,
  },
};

export const WithAsyncDefaultValues: DetailPageStory = {
  args: {
    defaultValues() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...UserDefaultValues,
            name: 'Async resolved name',
          });
        }, 5000);
      });
    },
  },
};

export const WithAlerts: DetailPageStory = {
  args: {
    alerts: [
      {
        message: 'Success message',
        type: 'success',
      },
      {
        message: 'Info message',
        type: 'info',
      },
      {
        message: 'Warning message',
        type: 'warning',
      },
      {
        message: 'Error message',
        type: 'error',
      },
    ],
  },
};

export const WithAsyncData: DetailPageStory = {
  args: {
    defaultReason: 'fetch',
  },
  render: (args) => {
    const [data, loading] = useFetchUserById();
    return <DetailPage {...args} loading={loading} data={data} />;
  },
};

export const ViewMode: DetailPageStory = {
  ...WithAsyncData,
  args: {
    reason: 'view',
    ...WithAsyncData.args,
  },
};

export const WithExtraCommands: DetailPageStory = {
  args: {
    onExtraCommands: () => (
      <>
        <Button
          onClick={() => alert('This is custom button command')}
          color="warning"
          startIcon={<User />}
        >
          Extra Command
        </Button>
        <Button
          onClick={() => alert('This is custom button command 2')}
          color="success"
          startIcon={<Edit />}
        >
          Extra Command 2
        </Button>
      </>
    ),
  },
};

export const WithCustomCommands: DetailPageStory = {
  args: {
    onCommands: (props) => <CustomCommands {...props} />,
  },
};

export const WithErrorAsyncData: DetailPageStory = {
  args: {
    defaultReason: 'fetch',
    data: mockData[0],
  },
  render: (args) => {
    const [loading, setloading] = useState(true);
    const [error, setError] = useState<ServerError>();

    const callError = useCallback((error: string) => {
      setTimeout(() => {
        setloading(false);
        setError({ message: `${error} (external)`, statusCode: '5000' });
      }, 1500);
    }, []);

    useEffect(() => {
      callError('Query fetching failed');
    }, [callError]);

    return (
      <DetailPage
        {...args}
        loading={loading}
        error={error}
        onExtraCommands={() => {
          return (
            <Button
              onClick={() => {
                setloading(true);
                callError('Saving failed');
              }}
            >
              Call external endpoint
            </Button>
          );
        }}
        onSave={() => {
          setloading(true);
          callError('Save mutation failed');
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          return Promise.reject({
            message: 'Failure message (internal)',
            statusCode: 5001,
            errors: [{ message: 'Inner exception' }, { message: 'Inner exception 2' }],
          });
        }}
      />
    );
  },
};

export const DisabledMode: DetailPageStory = {
  render(args) {
    const [isDisabled, setDisabled] = useState<boolean>(true);
    return (
      <DetailPage
        {...args}
        disabled={isDisabled}
        onReasonChange={useCallback(() => {
          setDisabled(false);
        }, [])}
        footerContent={
          <DisableStateButtons isDisabled={isDisabled} onDisabledChange={setDisabled} />
        }
      />
    );
  },
};

export const WithCustomTitle: DetailPageStory = {
  args: {
    defaultReason: 'fetch',
    data: mockData[0],
    header: <CustomTitle />,
  },
};

export const CopyingMode: DetailPageStory = {
  args: {
    reason: 'copy',
  },
};

export const AutoSave: DetailPageStory = {
  args: {
    autoSave: true,
    showHeader: false,
    onSave() {
      alert('Auto saved');
    },
  },
};

export const WithZodRefine: DetailPageStory = {
  args: {
    defaultReason: 'fetch',
  },
  render: (args) => {
    const [data, loading] = useFetchUserById();
    const [s, { addRefine }] = useZodRefine({ schema: userSchema });

    useEffect(() => {
      addRefine(
        { name: true, username: true },
        ({ name, username }) => {
          return !!username || !!name;
        },
        {
          message: 'Either name or username must be provided',
        },
      );
    }, [addRefine]);

    return <DetailPage {...args} schema={s} data={data} loading={loading} />;
  },
};

export const OpenInModal: DetailPageModalStory = {
  args: {
    defaultReason: 'fetch',
    data: mockData[0] as unknown as UserSchema,
    enableDelete: false,
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle DetailPage Modal</Button>
        <DetailPage.Modal
          {...args}
          open={visible}
          defaultSaveMode="save"
          onClose={() => setVisible(false)}
        />
      </>
    );
  },
};

export const ClassicModal: DetailPageModalStory = {
  args: {
    ...OpenInModal.args,
    commandsPosition: 'bottom-right',
    onCommands({ content }) {
      return (
        <FlexBetween width="100%">
          <Field.Switch name="isActive" label="Is Active ?" />
          <FlexBox gap={1}>{content}</FlexBox>
        </FlexBetween>
      );
    },
  },
  render: OpenInModal.render,
};

export const OpenInDrawer: DetailPageModalStory = {
  args: OpenInModal.args,
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle DetailPage Drawer</Button>
        <DetailPage.Drawer
          {...args}
          enableDelete={false}
          open={visible}
          onClose={() => {
            setVisible(false);
          }}
        />
      </>
    );
  },
};

export const OpenInDrawerWithCustomCommands: DetailPageModalStory = {
  args: OpenInModal.args,
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle DetailPage Drawer</Button>
        <DetailPage.Drawer
          {...args}
          enableDelete={false}
          commandsPosition="bottom"
          onCommands={({ props }) => (
            <Button
              onClick={props.onSaveClose}
              disabled={props.disabled.save}
              startIcon={<Add />}
              fullWidth
            >
              Save User
            </Button>
          )}
          open={visible}
          onClose={() => {
            setVisible(false);
          }}
        />
      </>
    );
  },
};

export const WithPopover: DetailPagePopoverStory = {
  args: { schema: userSchema.pick({ name: true }) as any },
  render: (args) => {
    const [elem, setElem] = useState<HTMLElement | null>(null);
    return (
      <>
        <Button onClick={(e) => setElem(e.currentTarget)}>Toggle DetailPage Drawer</Button>
        <DetailPage.Popover
          {...args}
          anchorEl={elem}
          onClose={() => {
            setElem(null);
          }}
          commandsPosition="bottom"
          onCommands={({ props }) => (
            <Button onClick={props.onSave} disabled={props.disabled.save} fullWidth>
              Save
            </Button>
          )}
        >
          <Page.Content>
            <Field.Input name="name" label="Name" autoFocus />
          </Page.Content>
        </DetailPage.Popover>
      </>
    );
  },
};

export const WithTabs: DetailPageStory = {
  args: {
    children: undefined,
    tabs: [
      {
        key: 'tab1',
        value: 'assigned',
        label: 'Assigned',
        icon: <Assignment />,
        children: (
          <Page.Content>
            <H2>Tab 1 content</H2>
          </Page.Content>
        ),
      },
      {
        key: 'tab2',
        value: 'pending',
        label: 'Pending',
        icon: <Pending />,
        children: (
          <Page.Content>
            <H2>Tab 2 content</H2>
          </Page.Content>
        ),
      },
      {
        key: 'tab3',
        value: 'done',
        label: 'Done',
        icon: <Done />,
        children: (
          <Page.Content>
            <H2>Tab 3 content</H2>
          </Page.Content>
        ),
      },
    ],
  },
};

export const WithCustomTabs: DetailPageStory = {
  args: {
    ...WithTabs.args,
    onTabs: CustomTabs,
  },
};

export const WithSteps: DetailPageStory = {
  args: {
    children: undefined,
    reason: 'create',
    steps: [
      {
        label: 'Person Info',
        optional: 'Please define person name',
        key: 'info',
        children: <Step1 />,
      },
      {
        label: 'Contact Details',
        optional: 'Please define contact info',
        key: 'additional',
        children: <Step2 />,
      },
      {
        label: 'Overview',
        optional: 'Please check your form to confirm',
        key: 'last',
        children: <Step3 />,
      },
    ],
  },
};

export const StepsWithCustomCommands: DetailPageStory = {
  args: {
    ...WithSteps.args,
    stepsProps: {
      showFinishButton: false,
      onCommands: (props) => <CustomStepCommands {...props} />,
    },
  },
};

export const InRouter: DetailPageRouteStory = {
  decorators: (Story) => {
    const router = createMemoryRouter(
      createRoutesFromElements(
        <Route
          path=""
          element={
            <Grid2 container spacing={2}>
              <Grid2 size={{ md: 4, xs: 12 }}>
                <UserList />
              </Grid2>
              <Grid2 size={{ md: 8, xs: 12 }}>
                <Outlet />
              </Grid2>
            </Grid2>
          }
        >
          <Route path=":id" element={<Story />} />
        </Route>,
      ),
      { initialEntries: ['/1'] },
    );

    return <RouterProvider router={router} />;
  },
  render(args) {
    const { id } = useDetailPageRouteParams();
    const [data, loading] = useFetchUserById(id);
    return <DetailPage.Route {...args} data={data} loading={loading} />;
  },
};

export const RoutedTabs: DetailPageRouteStory = {
  ...InRouter,
  args: {
    children: undefined,
    ...InRouter.args,
    tabs: [
      {
        key: 'tab1',
        value: 'assigned',
        label: 'Assigned',
        icon: <Assignment />,
        children: (
          <Page.Content>
            <H2>Tab 1 content</H2>
          </Page.Content>
        ),
      },
      {
        key: 'tab2',
        value: 'pending',
        label: 'Pending',
        icon: <Pending />,
        children: (
          <Page.Content>
            <H2>Tab 2 content</H2>
          </Page.Content>
        ),
      },
      {
        key: 'tab3',
        value: 'done',
        label: 'Done',
        icon: <Done />,
        children: (
          <Page.Content>
            <H2>Tab 3 content</H2>
          </Page.Content>
        ),
      },
    ],
  },
};

export const InRouterModal: DetailPageRouteStory = {
  ...InRouter,
  render(args) {
    const { id } = useDetailPageRouteParams();
    const [data, loading] = useFetchUserById(id);
    return <DetailPage.RouteModal {...args} data={data} loading={loading} />;
  },
};

export const NestedRouteTabs: DetailPageRouteStory = {
  render: () => {
    const router = createMemoryRouter(
      createRoutesFromElements(
        <Route
          path=""
          element={
            <Grid2 container spacing={2}>
              <Grid2 size={{ md: 4, xs: 12 }}>
                <UserList />
              </Grid2>
              <Grid2 size={{ md: 8, xs: 12 }}>
                <Outlet />
              </Grid2>
            </Grid2>
          }
        >
          <Route path=":id">
            <Route path="info" element={<NestedUserInfoRouteTab />} />
            <Route path="todos" element={<NestedTodosRouteTab />} />
            <Route index element={<Navigate to="info" replace />} />
          </Route>
        </Route>,
      ),
      { initialEntries: ['/1'] },
    );

    return <RouterProvider router={router} />;
  },
};
