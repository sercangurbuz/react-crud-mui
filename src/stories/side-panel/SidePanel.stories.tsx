import { useState } from 'react';
import { Link, MemoryRouter } from 'react-router-dom';

import {
  DeleteOutlined,
  Fingerprint,
  Instagram,
  Key,
  Link as LinkIcon,
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
      { key: '7', name: 'Connected accounts', icon: <LinkIcon /> },
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
      {
        key: '1',
        name: (
          <Link style={{ color: 'inherit' }} to="/basic-information">
            Basic Information
          </Link>
        ),
        icon: <UserOutlined />,
      },
      { key: '2', name: <Link to="/password">Password</Link>, icon: <LockOutlined /> },
      {
        key: '3',
        name: <Link to="/preferences">Preferences</Link>,
        icon: <SettingsOutlined />,
      },
      {
        key: '4',
        name: <Link to="/recent-devices">Recent Devices</Link>,
        icon: <DevicesApple />,
      },
      {
        key: '5',
        name: <Link to="/notification">Notifications</Link>,
        icon: <NotificationOutlined />,
      },
      {
        key: '6',
        name: <Link to="/two-step-verification">Two-step verification</Link>,
        icon: <Fingerprint />,
      },
      { key: '7', name: <Link to="/connected-accounts">Connected accounts</Link>, icon: <LinkIcon /> },
      { key: '8', name: <Link to="/social-account">Social Account</Link>, icon: <Instagram /> },
      { key: '9', name: <Link to="/billing">Billing</Link>, icon: <DollarOutlined /> },
      { key: '10', name: <Link to="/statements">Statements</Link>, icon: <FileOutlined /> },
      {
        key: '11',
        name: <Link to="/referrals">Referrals</Link>,
        icon: <PremiumOutlined />,
      },
      { key: '12', name: <Link to="/api-keys">API Keys</Link>, icon: <Key /> },
      {
        key: '13',
        name: <Link to="/delete-account">Delete account</Link>,
        icon: <DeleteOutlined />,
      },
    ],
  },
};
