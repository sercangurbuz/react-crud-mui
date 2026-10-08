import { useParams } from 'react-router-dom';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import {
  NeedDataReasonValues,
  type NeedDataReason,
} from '../../detail-page/pages/DetailPageContent';
import useSegmentParams, { UseSegmentParamsOptions } from './useSegmentParams';

type UseDetailPageRouteParamsOptions = UseSegmentParamsOptions & {
  uniqueIdParamName?: string;
};

const validateReason = (reason: string | undefined): reason is NeedDataReason => {
  return !!(reason && reason in NeedDataReasonValues);
};

function useDetailPageRouteParams<
  Params extends Record<string, string | undefined> = Record<string, string | undefined>,
>({
  uniqueIdParamName: customUniqueIdParamName,
  ...segmentOptions
}: UseDetailPageRouteParamsOptions = {}) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { uniqueIdParamName, reasonParamName } = useSettings();
  const params = useParams<Params>();
  const [segment, setSegment] = useSegmentParams(segmentOptions);
  const id = (params as Record<string, string | undefined>)[
    customUniqueIdParamName ?? uniqueIdParamName
  ];

  /* ---------------------------- Determine reason ---------------------------- */

  const reasonParam = (params as Record<string, string | undefined>)[reasonParamName];
  const reason = validateReason(reasonParam) ? reasonParam : NeedDataReasonValues.create;

  return {
    reason,
    id,
    segment,
    setSegment,
    params,
  } as const;
}

export default useDetailPageRouteParams;
