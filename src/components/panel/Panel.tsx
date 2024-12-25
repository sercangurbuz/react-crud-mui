import { ReactNode, useState } from 'react';

import { Card, Stack, styled } from '@mui/material';

import { FlexBetween } from '../flexbox';
import Header, { HeaderProps } from '../header/Header';
import MoreButton from '../more-button';

export type PanelTab = {
  key: React.Key;
  value: string;
  children: ReactNode;
  title: ReactNode;
};
export interface PanelProps extends HeaderProps {
  tabs?: PanelTab[];
}

const TabContentWrapper = styled(FlexBetween)(({ theme }) => ({
  [theme.breakpoints.down(730)]: {
    flexDirection: 'column',
    '& .list-item': { flex: 1 },
    '& .list': { width: '100%' },
    '& > button': { display: 'none' },
  },
}));

const BoxWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: number }>(({ theme, active }) => ({
  padding: '1.5rem',
  cursor: 'pointer',
  borderRadius: '0 0 12px 12px',
  ...(active && { backgroundColor: theme.palette.action.selected }),
}));

function Panel({ tabs, children, ...headerProps }: PanelProps) {
  const [selectedItem, setSelectedItem] = useState(tabs ? tabs[0].value : '');

  const handleChange = (id: string) => () => setSelectedItem(id);

  const renderTabContent = () => {
    const selTab = tabs?.find((tab) => tab.value === selectedItem);
    return selTab?.children;
  };

  return (
    <Card>
      {tabs ? (
        <TabContentWrapper gap={4}>
          <Stack className="list" gap={1} direction={{ sm: 'row', xs: 'column' }}>
            {tabs.map((item) => (
              <BoxWrapper
                key={item.key}
                className="list-item"
                onClick={handleChange(item.value)}
                active={selectedItem === item.value ? 1 : 0}
              >
                {item.title}
              </BoxWrapper>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            {headerProps.rightContent}
            {headerProps.moreOptions?.length ? (
              <MoreButton options={headerProps.moreOptions} sx={{ mr: 2 }} />
            ) : null}
          </Stack>
        </TabContentWrapper>
      ) : (
        <Header {...headerProps} />
      )}
      {tabs ? renderTabContent() : children}
    </Card>
  );
}

export default Panel;
Panel.Header = Header;
