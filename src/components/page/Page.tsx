import { ReactNode } from 'react';

import { FlexBox } from '../flexbox';
import Header, { HeaderProps } from '../header/Header';
import DefaultLayout, { PageLayoutProps } from './components/DefaultLayout';
import PageContent from './components/PageContent';
import PageDivider from './components/PageDivider';
import PageProvider, { PaddingSize } from './components/PageProvider';

export interface PageProps extends Omit<HeaderProps, 'rightContent'> {
  commandsContent?: ReactNode;
  commandsPosition?: 'header' | 'footer';
  onHeader?: (props: HeaderProps) => ReactNode;
  onLayout?: (props: PageLayoutProps) => ReactNode;
  onClose?: () => void;
  showHeader?: boolean;
  footerContent?: ReactNode;
  alertsContent?: ReactNode;
  size?: PaddingSize;
  disabled?: boolean;
  loading?: boolean;
  disableShortCuts?: boolean;
}

export const PagePadding: Record<PaddingSize, number> = { large: 4, normal: 3, small: 2 };

function Page({
  alertsContent,
  children,
  commandsContent,
  commandsPosition = 'header',
  disabled,
  footerContent,
  loading,
  onHeader,
  onLayout,
  showHeader = true,
  size = 'small',
  ...headerProps
}: PageProps) {
  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderHeader = () => {
    if (!showHeader) {
      return null;
    }

    const props: HeaderProps = {
      ...headerProps,
      headerProps: {
        fontSize: 16,
        fontWeight: 400,
      },
      px: PagePadding[size],
      pt: PagePadding[size],
      rightContent: commandsPosition === 'header' ? commandsContent : null,
    };

    return onHeader ? onHeader(props) : <Header {...props} />;
  };

  const renderFooter = () => {
    return (
      <FlexBox justifyContent="flex-end" p={PagePadding[size]}>
        {footerContent}
        {commandsPosition === 'footer' ? commandsContent : null}
      </FlexBox>
    );
  };

  const renderLayout = () => {
    const pageProps: PageLayoutProps = {
      commandsContent,
      content: children,
      pageHeader: renderHeader(),
      footerContent: renderFooter(),
      alertsContent,
      options: {
        size,
        disabled,
        loading,
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
