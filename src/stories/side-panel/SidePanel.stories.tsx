import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  DeleteOutlined,
  Fingerprint,
  Instagram,
  Key,
  Link,
  LockOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import DevicesApple from '../../components/icons/DevicesApple';
import DollarOutlined from '../../components/icons/DollarOutlined';
import FileOutlined from '../../components/icons/FileOutlined';
import NotificationOutlined from '../../components/icons/NotificationOutlined';
import PremiumOutlined from '../../components/icons/PremiumOutlined';
import UserOutlined from '../../components/icons/UserOutlined';
import SidePanel from '../../components/side-panel/SidePanel';

const meta: Meta<typeof SidePanel> = {
  title: 'Components/SidePanel',
  args: {
    sx: { width: '300px' },
    items: [
      { key: '1', name: 'Basic Information', icon: <UserOutlined /> },
      { key: '2', name: 'Password', icon: <LockOutlined /> },
      { key: '3', name: 'Preferences', icon: <SettingsOutlined /> },
      { key: '4', name: 'Recent Devices', icon: <DevicesApple /> },
      { key: '5', name: 'Notifications', icon: <NotificationOutlined /> },
      { key: '6', name: 'Two-step verification', icon: <Fingerprint /> },
      { key: '7', name: 'Connected accounts', icon: <Link /> },
      { key: '8', name: 'Social Account', icon: <Instagram /> },
      { key: '9', name: 'Billing', icon: <DollarOutlined /> },
      { key: '10', name: 'Statements', icon: <FileOutlined /> },
      { key: '11', name: 'Referrals', icon: <PremiumOutlined /> },
      { key: '12', name: 'API Keys', icon: <Key /> },
      { key: '13', name: 'Delete account', icon: <DeleteOutlined /> },
    ],
  },
  component: SidePanel,
};

export default meta;
type SidePanelStory = StoryObj<typeof SidePanel>;

export const Simple: SidePanelStory = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeKey, setActiveKey] = useState(args.items[0].key);
    return (
      <SidePanel {...args} activeKey={activeKey} onItemClick={(item) => setActiveKey(item.key)} />
    );
  },
};

export const WithLinks: SidePanelStory = {
  decorators: (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
  args: {
    items: [
      { key: '1', name: 'Basic Information', icon: <UserOutlined />, link: '/basic-info' },
      { key: '2', name: 'Password', icon: <LockOutlined />, link: '/password' },
      { key: '3', name: 'Preferences', icon: <SettingsOutlined />, link: '/preferences' },
      { key: '4', name: 'Recent Devices', icon: <DevicesApple />, link: '/recent-devices' },
      { key: '5', name: 'Notifications', icon: <NotificationOutlined />, link: '/notifications' },
      { key: '6', name: 'Two-step verification', icon: <Fingerprint />, link: '/two-step' },
      { key: '7', name: 'Connected accounts', icon: <Link />, link: '/connected-accounts' },
      { key: '8', name: 'Social Account', icon: <Instagram />, link: '/social-account' },
      { key: '9', name: 'Billing', icon: <DollarOutlined />, link: '/billing' },
      { key: '10', name: 'Statements', icon: <FileOutlined />, link: '/statements' },
      { key: '11', name: 'Referrals', icon: <PremiumOutlined />, link: '/referrals' },
      { key: '12', name: 'API Keys', icon: <Key />, link: '/api-keys' },
      { key: '13', name: 'Delete account', icon: <DeleteOutlined />, link: '/delete-account' },
    ],
  },
};
