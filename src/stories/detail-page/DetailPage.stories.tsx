import { useCallback, useEffect, useState } from 'react';

import { Assignment, Done, Pending } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import { useZodRefine } from '../../components/hooks';
import Add from '../../components/icons/Add';
import Edit from '../../components/icons/Edit';
import GroupSenior from '../../components/icons/GroupSenior';
import User from '../../components/icons/User';
import Page from '../../components/page/Page';
import { useAppQuery } from '../../components/query';
import { H2 } from '../../components/typography';
import { ServerError } from '../../components/utils';
import mockData from '../../test-setup/mockUsers.json';
import { handleDeleteUser, handleSaveUser, UserDefaultValues } from '../utils/api';
import { userSchema, type UserSchema } from '../utils/schema';
import CustomCommands from './components/CustomCommands';
import CustomStepCommands from './components/CustomStepCommands';
import CustomTabs from './components/CustomTabs';
import CustomTitle from './components/CustomTitle';
import DisableStateButtons from './components/DisableStateButtons';
import FormContent from './components/FormContent';
import { Step1, Step2, Step3 } from './components/Steps';

const meta: Meta<typeof DetailPage<UserSchema>> = {
  title: 'Components/DetailPage',
  component: DetailPage,
  args: {
    header: 'User Details',
    helperText: 'Type in user settings',
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
    component: FormContent,
    defaultReason: 'create',
    enableDelete: true,
    onSave: handleSaveUser,
    onDelete: handleDeleteUser,
    createCommandLabel: 'New User',
  },
};

export default meta;
type DetailPageStory = StoryObj<typeof DetailPage>;
type DetailPageModalStory = StoryObj<typeof DetailPage.Modal<UserSchema>>;

export const Simple: DetailPageStory = {};

export const LoadingState: DetailPageStory = {
  args: {
    loading: true,
  },
};

export const WithAsyncData: DetailPageStory = {
  args: {
    defaultReason: 'fetch',
  },
  render: (args) => {
    const { data, isFetching } = useAppQuery<UserSchema>({
      queryKey: ['user'],
      url: 'https://jsonplaceholder.typicode.com/users/1',
    });

    return <DetailPage {...args} loading={isFetching} data={data} />;
  },
};

export const WithChildrenContent: DetailPageStory = {
  args: {
    component: undefined,
  },
  render: (args) => {
    return (
      <DetailPage {...args}>
        <FormContent />
      </DetailPage>
    );
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
        setError({ message: `${error} (external)` });
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
          return Promise.reject({ message: 'Failure message (internal)' });
        }}
      />
    );
  },
};

export const DisabledMode: DetailPageStory = {
  render(args) {
    const [isDisabled, setDisabled] = useState<boolean>(false);
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
    defaultValues: UserDefaultValues,
    schema: userSchema,
  },
  render: (args) => {
    const { data, isFetching } = useAppQuery<UserSchema>({
      queryKey: ['user'],
      url: 'https://jsonplaceholder.typicode.com/users/1',
    });

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

    return <DetailPage {...args} schema={s} data={data} loading={isFetching} />;
  },
};

export const OpenInModal: DetailPageModalStory = {
  args: {
    defaultReason: 'fetch',
    data: mockData[0],
    defaultValues: UserDefaultValues,
    schema: userSchema,
    enableDelete: false,
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle DetailPage Modal</Button>
        <DetailPage.Modal {...args} open={visible} onClose={() => setVisible(false)} />
      </>
    );
  },
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
          schema={userSchema}
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
            <Button onClick={props.onSaveClose} startIcon={<Add />} fullWidth>
              Save User
            </Button>
          )}
          open={visible}
          schema={userSchema}
          onClose={() => {
            setVisible(false);
          }}
        />
      </>
    );
  },
};

export const WithTabs: DetailPageStory = {
  args: {
    component: undefined,
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
    customTabs: CustomTabs,
  },
};

export const WithSteps: DetailPageStory = {
  args: {
    component: undefined,
    defaultValues: UserDefaultValues,
    reason: 'create',
    schema: [
      z.object({
        name: z.string().min(1),
        username: z.string().min(1),
      }),
      userSchema.pick({ phone: true, email: true, website: true }),
    ],
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
      commands: CustomStepCommands,
    },
  },
};
