import { useLocation } from 'react-router-dom';

import { FlexBox } from '../../../components/flexbox';
import ListPage from '../../../components/list-page/pages/ListPage';
import { Small } from '../../../components/typography';

function ListPageWithRoute(props: any) {
  const { pathname, search } = useLocation();
  return (
    <ListPage.Route
      {...props}
      helperText={
        <FlexBox gap={1}>
          <Small>URL : </Small>
          <Small>
            {pathname}
            {search}
          </Small>
        </FlexBox>
      }
    />
  );
}

export default ListPageWithRoute;
