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

import Assignment from '@mui/icons-material/Assignment';
import Done from '@mui/icons-material/Done';
import Pending from '@mui/icons-material/Pending';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import useDetailPageRouteParams from '../../components/detail-page/hooks/useDetailPageRouteParams';
import { FlexBox } from '../../components/flexbox';
import FormControl from '../../components/form/components/FormControl';
import Field from '../../components/form/Field';
import { useZodRefine } from '../../components/hooks';
import Add from '../../components/icons/Add';
import Edit from '../../components/icons/Edit';
import GroupSenior from '../../components/icons/GroupSenior';
import User from '../../components/icons/User';
import Page from '../../components/page/Page';
import Tag from '../../components/tag';
import { H2 } from '../../components/typography';
import { ServerError } from '../../components/utils';
import mockData from '../../test-setup/mockUsers.json';
import {
  handleDeleteUser,
  handleSaveUser,
  useFetchUserById,
  UserDefaultValues,
} from '../utils/api';
import { stepSchema, StepSchema, userSchema, type UserSchema } from '../utils/schema';
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
    commandsProps: {
      create: { children: 'New User' },
    },
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
    data: undefined,
    reason: 'fetch',
    defaultValues(reason) {
      if (reason === 'create') {
        return UserDefaultValues;
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData[1]);
        }, 5000);
      });
    },
  },
};

export const WithAlerts: DetailPageStory = {
  args: {
    alerts: [
      {
        title: 'Success',
        message: 'Success message',
        type: 'success',
      },
      {
        title: 'Info',
        message: 'Info message',
        type: 'info',
      },
      {
        title: 'Warning',
        message: 'Warning message',
        type: 'warning',
      },
      {
        title: 'Error',
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

export const CustomCommandsLabel: DetailPageStory = {
  ...WithAsyncData,
  args: {
    ...WithAsyncData.args,
    commandsProps: {
      create: { children: 'Create New User' },
      save: { children: 'Save User' },
      delete: { children: 'Delete User' },
    },
  },
};

export const ViewMode: DetailPageStory = {
  ...WithAsyncData,
  args: {
    ...WithAsyncData.args,
    defaultReason: 'view',
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
  ...WithAsyncData,
  args: {
    ...WithAsyncData.args,
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

export const Disabled: DetailPageStory = {
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
    showHeader: false,
    onSave() {
      alert('Auto saved');
    },
  },
};

export const StaticTextValidationAlert: DetailPageStory = {
  args: {
    validationOptions: {
      alertVisibility: 'static-text',
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
  name: 'Open In Modal (Long content)',
  args: {
    defaultReason: 'fetch',
    enableDelete: true,
    defaultValues(reason) {
      if (reason === 'create') {
        return UserDefaultValues;
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData[1]);
        }, 5000);
      });
    },
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle DetailPage Modal</Button>
        <DetailPage.Modal {...args} open={visible} onClose={() => setVisible(false)}>
          <FormContent />
          <FormContent />
          <FormContent />
          <FormContent />
          <FormContent />
          <FormContent />
        </DetailPage.Modal>
      </>
    );
  },
};

export const ClassicModal: DetailPageModalStory = {
  args: {
    ...OpenInModal.args,
    commandsPosition: 'bottom-between',
    onCommands(props) {
      return (
        <>
          <Field.Switch name="isActive" label="Is Active ?" />
          <FlexBox gap={1}>
            <DetailPage.Commands {...props} />
          </FlexBox>
        </>
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
          open={visible}
          enableCreate={true}
          onClose={() => {
            setVisible(false);
          }}
        >
          <FormContent />
          <FormContent />
          <FormContent />
          <FormContent />
          <FormContent />
          <FormContent />
        </DetailPage.Drawer>
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
          onCommands={({ onSaveClose }) => (
            <Button onClick={onSaveClose} startIcon={<Add />} fullWidth>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          onCommands={({ onSave }) => (
            <Button onClick={onSave} fullWidth>
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
    defaultValues() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData[1]);
        }, 2000);
      });
    },
    children: undefined,
    tabExtraContent(data) {
      return data?.name ? <Tag>{data?.name}</Tag> : null;
    },
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

export const WithTabsSuccessPanel: DetailPageStory = {
  ...WithTabs,
  args: {
    ...WithTabs.args,
    successPanelProps: {
      title: 'User saved successfully!',
      helperText: 'You have successfully saved the user.',
    },
  },
};

export const WithSteps: StoryObj<typeof DetailPage<StepSchema>> = {
  render(args) {
    return (
      <DetailPage
        {...args}
        schema={stepSchema}
        enableClose
        defaultValues={{
          main: {
            name: '',
            username: '',
          },
          contact: {
            email: '',
            phone: '',
            website: '',
          },
          address: {
            city: '',
            street: '',
            suite: '',
            zipcode: '',
          },
        }}
        steps={[
          {
            label: 'Person Info',
            optional: 'Please define person name',
            key: 'main',
            name: 'main',
            schema: z.object({
              name: z.string().min(1),
              username: z.string().min(1),
            }),
            children: <Step1 />,
          },
          {
            label: 'Contact Details',
            optional: 'Please define contact info',
            key: 'contact',
            name: 'contact',
            schema: z.object({
              email: z.string().email().min(1, { message: 'Email is missing' }),
              website: z.string().min(1, { message: 'Website is missing' }),
              phone: z.string(),
            }),
            validationOptions: {
              alertVisibility: 'all',
            },
            children: <Step2 />,
            forceRender: true,
          },
          {
            key: 'overview',
            label: 'Overview',
            optional: 'Please check your data and save',
            children: <Step3 />,
          },
        ]}
      >
        <Page.Content>
          <FormControl label="Main data">
            <Field.Watch showAsJson name="main" />
          </FormControl>
          <FormControl label="Contact data">
            <Field.Watch showAsJson name="contact" />
          </FormControl>
        </Page.Content>
      </DetailPage>
    );
  },
};

export const WithStepsSuccessResultPanel: StoryObj<typeof DetailPage<StepSchema>> = {
  ...WithSteps,
  args: {
    ...WithSteps.args,
    successPanelProps: {
      title: 'User saved successfully!',
      helperText: 'You have successfully completed all steps and saved the user.',
      onCommands: (model) => (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            alert(`User ${model?.main?.name} saved successfully!`);
          }}
        >
          Back to list
        </Button>
      ),
    },
  },
};

export const StepsWithCustomCommands: StoryObj<typeof DetailPage<StepSchema>> = {
  ...WithSteps,
  args: {
    onCommands: (props) => <CustomStepCommands {...props} />,
  },
};

export const StepsWithFetchMode: StoryObj<typeof DetailPage<StepSchema>> = {
  ...WithSteps,
  args: {
    reason: 'fetch',
    data: {
      main: {
        name: mockData[0].name,
        username: mockData[0].username,
      },
      contact: {
        email: mockData[0].email,
        phone: mockData[0].phone,
        website: mockData[0].website,
      },
      address: {
        street: mockData[0].address?.street,
        suite: mockData[0].address?.suite,
        city: mockData[0].address?.city,
        zipcode: mockData[0].address?.zipcode,
      },
    },
    ...WithSteps.args,
    children: <FormContent />,
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
