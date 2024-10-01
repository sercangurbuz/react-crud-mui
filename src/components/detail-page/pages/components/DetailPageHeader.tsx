import React, { PropsWithChildren } from 'react';

import Header, { HeaderProps } from '../../../header/Header';
import useTranslation from '../../../i18n/hooks/useTranslation';
import useDetailPageStates from '../../hooks/useDetailPageCommandStates';
import { DetailPageAction, NeedDataReason } from '../DetailPageContent';

export interface DetailPageHeaderProps extends HeaderProps, PropsWithChildren {
  reason: NeedDataReason;
  action?: DetailPageAction;
}

function DetailPageHeader({ reason, action, ...headerProps }: DetailPageHeaderProps) {
  /* const { t } = useTranslation();
  const {
    formStates: { isValid, isDirty },
    isDisabled,
    isNew,
    loading,
  } = useDetailPageStates(); */

  return <Header {...headerProps} />;
}

export default DetailPageHeader;
