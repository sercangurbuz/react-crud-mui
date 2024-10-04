import { Button } from '@mui/material';

import useDetailPage from '../../../components/detail-page/hooks/useDetailPage';
import { DefaultTabsProps } from '../../../components/page/components/DefaultTabs';
import Page from '../../../components/page/Page';

function CustomTabs(props: DefaultTabsProps) {
  const { setActiveSegment } = useDetailPage();
  return (
    <Page.Tabs
      {...props}
      tabs={props.tabs.map((tab) => ({
        ...tab,
      }))}
    />
  );
}

export default CustomTabs;
