import { PropsWithChildren } from 'react';

import Header, { HeaderProps } from '../../header/Header';
import { NeedDataReason } from '../pages/DetailPageContent';

export interface DetailPageHeaderProps extends HeaderProps, PropsWithChildren {
  reason: NeedDataReason;
}

function DetailPageHeader({ reason, ...headerProps }: DetailPageHeaderProps) {
  return <Header {...headerProps} />;
}

export default DetailPageHeader;
