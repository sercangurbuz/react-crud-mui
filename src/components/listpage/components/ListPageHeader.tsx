import { PropsWithChildren } from 'react';

import Header, { HeaderProps } from '../../header/Header';

export interface ListPageHeaderProps extends HeaderProps, PropsWithChildren {}

function ListPageHeader(props: ListPageHeaderProps) {
  return <Header {...props} />;
}

export default ListPageHeader;
