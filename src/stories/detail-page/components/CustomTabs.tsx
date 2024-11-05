import { DefaultTabsProps } from '../../../components/page/components/DefaultTabs';
import Page from '../../../components/page/Page';

function CustomTabs(props: DefaultTabsProps) {
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
