import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import useSettings from '../../settings-provider/hooks/useSettings';
import useSegmentParams, { UseSegmentParamsOptions } from './useSegmentParams';

type UseDetailPageRouteParamsOptions = UseSegmentParamsOptions & {
  uniqueIdParamName?: string;
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

  const { uniqueIdParamName, newItemParamValue } = useSettings();
  const params = useParams<Params>();
  const [currentQueryParameters] = useSearchParams();
  const [segment, setSegment] = useSegmentParams(segmentOptions);
  const { state } = useLocation();
  const id = (params as Record<string, string | undefined>)[
    customUniqueIdParamName ?? uniqueIdParamName
  ];

  const hasRouteValue = (key: string) => currentQueryParameters.has(key) || state?.[key];

  /* ---------------------------- Determine reason ---------------------------- */

  const reason = hasRouteValue('copy') ? 'copy' : id === newItemParamValue ? 'create' : 'fetch';
  const disabled = !!hasRouteValue('disabled');
  const readonly = !!hasRouteValue('readonly');

  return {
    reason,
    id,
    segment,
    setSegment,
    disabled,
    readonly,
    params,
  } as const;
}

export default useDetailPageRouteParams;
