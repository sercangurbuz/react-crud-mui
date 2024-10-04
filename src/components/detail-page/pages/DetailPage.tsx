import { useCallback, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import DetailPageDefaultLayout from '../components/DetailPageDefaultLayout';
import DetailPageHeader from '../components/DetailPageHeader';
import { NeedDataReason } from './DetailPageContent';
import DetailPageDrawer from './DetailPageDrawer';
import DetailPageForm, { DetailPageFormProps } from './DetailPageForm';
import DetailPageModal from './DetailPageModal';

export interface DetailPageProps<TModel extends FieldValues> extends DetailPageFormProps<TModel> {
  defaultReason?: NeedDataReason;
  defaultSegmentValue?: string;
}

function DetailPage<TModel extends FieldValues>({
  defaultReason = 'create',
  defaultSegmentValue = '',
  onReasonChange,
  ...dpProps
}: DetailPageProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // controlled reason state
  const [reason, setReason] = useState<NeedDataReason>(defaultReason);
  // keep segment indicators here to manage in context
  const [activeSegmentValue, setActiveSegmentValue] = useState<string>(defaultSegmentValue);

  const handleReasonChange = useCallback(
    (reason: NeedDataReason) => {
      setReason(reason);
      onReasonChange?.(reason);
    },
    [onReasonChange],
  );

  return (
    <DetailPageForm<TModel>
      reason={reason}
      onReasonChange={handleReasonChange}
      activeSegmentValue={activeSegmentValue}
      onSegmentChanged={setActiveSegmentValue}
      {...dpProps}
    />
  );
}

export default DetailPage;

DetailPage.Header = DetailPageHeader;
DetailPage.Modal = DetailPageModal;
DetailPage.Drawer = DetailPageDrawer;
DetailPage.Layout = DetailPageDefaultLayout;
