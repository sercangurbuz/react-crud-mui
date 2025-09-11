import { ReactNode, useState } from 'react';

import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { FlexBetween } from '../flexbox';
import Header, { HeaderOwnProps } from '../header/Header';
import MoreButton from '../more-button';

export type PanelTab = {
  key: React.Key;
  value: string;
  children?: ReactNode;
  title: ReactNode;
};
export interface PanelProps extends CardProps, HeaderOwnProps {
  tabs?: PanelTab[];
  activeTabKey?: string;
  onTabChange?: (key: string) => void;
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
  ...(active && {
    backgroundColor: theme.palette.action.selected,
    boxShadow: theme.shadows[1],
  }),
}));

function Panel({
  tabs,
  children,
  rightContent,
  centerContent,
  helperText,
  header,
  headerProps,
  icon,
  moreOptions,
  useHeaderIconWrapper,
  activeTabKey,
  onTabChange,
  ...cardProps
}: PanelProps) {
  const [selectedItem, setSelectedItem] = useState(activeTabKey ?? (tabs ? tabs[0].value : ''));

  const handleChange = (id: string) => () => {
    setSelectedItem(id);
    onTabChange?.(id);
  };

  const selectedTabKey = activeTabKey || selectedItem;

  const renderTabContent = () => {
    const selTab = tabs?.find((tab) => tab.value === selectedTabKey);
    return selTab?.children;
  };

  return (
    <Card {...cardProps}>
      {tabs ? (
        <TabContentWrapper gap={4}>
          <Stack className="list" gap={1} direction={{ sm: 'row', xs: 'column' }}>
            {tabs.map((item) => (
              <BoxWrapper
                key={item.key}
                className="list-item"
                onClick={handleChange(item.value)}
                active={selectedTabKey === item.value ? 1 : 0}
              >
                {item.title}
              </BoxWrapper>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            {rightContent}
            {moreOptions?.length ? <MoreButton options={moreOptions} sx={{ mr: 2 }} /> : null}
          </Stack>
        </TabContentWrapper>
      ) : (
        <Header
          rightContent={rightContent}
          centerContent={centerContent}
          helperText={helperText}
          header={header}
          headerProps={headerProps}
          icon={icon}
          moreOptions={moreOptions}
          useHeaderIconWrapper={useHeaderIconWrapper}
        />
      )}
      {tabs ? renderTabContent() : null}
      {children}
    </Card>
  );
}

export default Panel;
Panel.Header = Header;
