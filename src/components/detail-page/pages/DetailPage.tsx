import { useCallback, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import { NeedDataReason } from './DetailPageContent';
import DetailPageForm, { DetailPageFormProps } from './DetailPageForm';

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

  // controlled reason state
  const [reason, setReason] = useState<NeedDataReason>(defaultReason);
  // keep segment indicators here to manage in context
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(defaultSegmentIndex);

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
      activeSegmentIndex={activeSegmentIndex}
      onSegmentChanged={setActiveSegmentIndex}
      {...dpProps}
    />
  );
}

export default DetailPage;
