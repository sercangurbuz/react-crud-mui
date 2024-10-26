import { useCallback, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import DetailPageDefaultLayout from '../components/DetailPageDefaultLayout';
import DetailPageHeader from '../components/DetailPageHeader';
import { NeedDataReason } from './DetailPageContent';
import DetailPageDrawer from './DetailPageDrawer';
import DetailPageForm, { DetailPageFormProps } from './DetailPageForm';
import DetailPageModal from './DetailPageModal';
import DetailPageRoute from './DetailPageRoute';
import DetailPageRouteModal from './DetailPageRouteModal';

export interface DetailPageProps<TModel extends FieldValues> extends DetailPageFormProps<TModel> {
  defaultReason?: NeedDataReason;
  defaultSegmentIndex?: number;
}

function DetailPage<TModel extends FieldValues>({
  defaultReason = 'create',
  defaultSegmentIndex = 0,
  onReasonChange,
  ...dpProps
}: DetailPageProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // controlled states
  const [reason, setReason] = useState<NeedDataReason>(defaultReason);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(defaultSegmentIndex);

  const handleReasonChange = (reason: NeedDataReason) => {
    setReason(reason);
    onReasonChange?.(reason);
  };

  return (
    <DetailPageForm<TModel>
      reason={reason}
      onReasonChange={handleReasonChange}
      activeSegmentIndex={activeSegmentIndex}
      onSegmentChanged={setActiveSegmentIndex}
      {...dpProps}
    />
  );
}

export default DetailPage;

DetailPage.Header = DetailPageHeader;
DetailPage.Modal = DetailPageModal;
DetailPage.RouteModal = DetailPageRouteModal;
DetailPage.Drawer = DetailPageDrawer;
DetailPage.Route = DetailPageRoute;
DetailPage.Layout = DetailPageDefaultLayout;
