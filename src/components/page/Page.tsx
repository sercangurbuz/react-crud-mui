import { ReactNode } from 'react';

import { Box, BoxProps, LinearProgress, styled } from '@mui/material';

import { FlexBox } from '../flexbox';
import Header, { HeaderProps } from '../header/Header';
import MorePanel, { MorePanelProps } from '../more-panel/MorePanel';
import DefaultLayout, { PageLayoutProps } from './components/DefaultLayout';
import DefaultTabs, {
  DefaultTabsProps,
  TabChangedPayload,
  TabPane,
} from './components/DefaultTabs';
import PageContent from './components/PageContent';
import PageDivider from './components/PageDivider';
import PageProvider, { PaddingSize } from './components/PageProvider';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type CloseReason = 'backdrop' | 'close-button' | 'action';
export type CommandsPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom'
  | 'top';
export type TabsPosition = 'in-center' | 'in-subrow';

export interface PageProps extends HeaderProps {
  commandsContent?: ReactNode;
  commandsPosition?: CommandsPosition;
  onHeader?: (props: HeaderProps) => ReactNode;
  onLayout?: (props: PageLayoutProps) => ReactNode;
  onClose?: (reason?: CloseReason) => void;
  showHeader?: boolean;
  footerContent?: ReactNode;
  alertsContent?: ReactNode;
  moreContent?: ReactNode;
  morePanelProps?: MorePanelProps;
  size?: PaddingSize;
  disabled?: boolean;
  loading?: boolean;
  disableShortCuts?: boolean;
  tabs?: TabPane[];
  tabsPosition?: TabsPosition;
  selectedTabIndex?: number;
  onTabChanged?: (selected: TabChangedPayload) => void;
  onTabs?: (props: DefaultTabsProps) => ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

export const PagePadding: Record<PaddingSize, number> = { large: 4, normal: 3, small: 2 };

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

const LoadingProgress = styled(LinearProgress)({
  height: 1.5,
  borderRadius: 0,
  margin: 0,
  flexGrow: 0,
});

function Page({
  alertsContent,
  children,
  commandsContent,
  commandsPosition = 'top-right',
  onTabs,
  disabled,
  footerContent,
  loading,
  onHeader,
  onLayout,
  moreContent,
  morePanelProps,
  showHeader = true,
  size = 'small',
  style,
  sx,
  tabs,
  onTabChanged,
  selectedTabIndex = 0,
  tabsPosition = 'in-center',
  rightContent,
  centerContent,
  ...headerProps
}: PageProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const commandsVertPos =
    commandsPosition === 'bottom' ||
    commandsPosition === 'bottom-left' ||
    commandsPosition === 'bottom-right'
      ? 'bottom'
      : 'top';

  const renderTabs = (tabProps?: Partial<DefaultTabsProps>) => {
    if (!tabs?.length) {
      return null;
    }

    const selectedTabValue = (
      selectedTabIndex <= tabs.length - 1 ? tabs[selectedTabIndex].value : ''
    ) as string;

    const props: DefaultTabsProps = {
      tabs,
      value: selectedTabValue,
      onChange: (_, value) => {
        const selIndex = tabs.findIndex((item) => item.value === value);
        onTabChanged?.({ selectedTabIndex: selIndex, selectedTabValue: value });
      },
      ...tabProps,
    };

    if (onTabs) {
      return onTabs(props);
    }

    return <DefaultTabs {...props} />;
  };

  const renderTabContent = () => {
    if (!tabs?.length) {
      return null;
    }

    const tabContent = selectedTabIndex <= tabs.length - 1 ? tabs[selectedTabIndex] : null;
    return tabContent?.children;
  };

  const renderCommands = () => {
    let justifyContent: BoxProps['justifyContent'] = 'flex-end';

    switch (commandsPosition) {
      case 'bottom':
      case 'top':
        justifyContent = 'center';
        break;
      case 'bottom-left':
      case 'top-left':
        justifyContent = 'flex-start';
        break;
      case 'bottom-right':
      case 'top-right':
        justifyContent = 'flex-end';
        break;
    }

    return (
      <FlexBox justifyContent={justifyContent} gap={1}>
        {commandsContent}
      </FlexBox>
    );
  };

  const renderHeader = () => {
    if (!showHeader) {
      return null;
    }

    const props: HeaderProps = {
      ...headerProps,
      headerProps: {
        fontSize: 16,
        fontWeight: 600,
      },
      p: PagePadding[size],
      rightContent: (
        <>
          {commandsVertPos === 'top' ? renderCommands() : null}
          {rightContent}
        </>
      ),
      centerContent: (
        <>
          {tabsPosition === 'in-center' ? renderTabs() : null}
          {centerContent}
        </>
      ),
      children: tabsPosition === 'in-subrow' ? renderTabs({ bordered: true, sx: { px: 2 } }) : null,
    };

    return onHeader ? onHeader(props) : <Header {...props} />;
  };

  const renderFooter = () => {
    const commands = commandsVertPos === 'bottom' ? renderCommands() : null;

    return (
      <>
        {commands ? <Box p={PagePadding[size]}>{commands}</Box> : null}
        {footerContent ? <Box p={PagePadding[size]}>{footerContent}</Box> : null}
      </>
    );
  };

  const renderProgress = () => {
    return <LoadingProgress style={{ visibility: loading ? 'visible' : 'hidden' }} />;
  };

  const renderLayout = () => {
    const pageProps: PageLayoutProps = {
      commandsContent,
      content: children,
      tabsContent: renderTabContent(),
      pageHeader: renderHeader(),
      footerContent: renderFooter(),
      progressContent: renderProgress(),
      alertsContent,
      moreContent: moreContent ? <MorePanel {...morePanelProps}>{moreContent}</MorePanel> : null,
      options: {
        size,
        disabled,
        loading,
        style,
        sx,
      },
    };

    return onLayout ? onLayout(pageProps) : <DefaultLayout {...pageProps} />;
  };

  return (
    <PageProvider size={size} disabled={disabled} loading={loading}>
      {renderLayout()}
    </PageProvider>
  );
}

export default Page;

Page.Content = PageContent;
Page.Divider = PageDivider;
Page.Layout = DefaultLayout;
Page.Tabs = DefaultTabs;
