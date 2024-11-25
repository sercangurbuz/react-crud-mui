import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useMatchedSegmentIndex, { SegmentModel } from './useMatchedSegment';

export interface UseSegmentParamsOptions {
  segmentParamName?: string;
  enableSegmentRouting?: boolean;
  enableNestedSegments?: boolean | string[];
  fallbackSegmentIndex?: number;
  paths?: SegmentModel[];
}

const DEFAULT_SEGMENT_INDEX = 0;

function useSegmentParams({
  segmentParamName: customSegmentParamName,
  enableNestedSegments,
  enableSegmentRouting = true,
  fallbackSegmentIndex = DEFAULT_SEGMENT_INDEX,
  paths,
}: UseSegmentParamsOptions = {}) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { segmentParamName } = useSettings();
  const navigate = useNavigate();
  // segment index from nested routing
  const getNestedSegmentIndex = useMatchedSegmentIndex();
  // segment from search params
  const [currentQueryParameters, setSearchParams] = useSearchParams();
  // fallback segment index state
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>();

  // fallback segment to local state if no routing segment enabled
  let segment = activeSegmentIndex;

  const nestedSegments = Array.isArray(enableNestedSegments)
    ? enableNestedSegments
    : paths?.map(({ key }) => key);

  if (enableSegmentRouting) {
    segment =
      enableNestedSegments && nestedSegments
        ? getNestedSegmentIndex(nestedSegments)
        : Number(currentQueryParameters.get(customSegmentParamName ?? segmentParamName));
  }

  if (segment && segment < 0 && fallbackSegmentIndex > -1) {
    // segment is unexpectedly below zero, set to fallbackSegmentIndex
    segment = fallbackSegmentIndex;
  }

  const setSegment = useCallback(
    (index: number) => {
      if (enableSegmentRouting) {
        if (enableNestedSegments && nestedSegments) {
          navigate(
            {
              pathname: `../${nestedSegments[index]}`,
              search:
                currentQueryParameters.size > 0 ? `?${currentQueryParameters.toString()}` : '',
            },
            {
              relative: 'path',
            },
          );
        } else {
          setSearchParams(
            new URLSearchParams({
              ...Object.fromEntries(currentQueryParameters),
              [customSegmentParamName ?? segmentParamName]: index.toString(),
            }),
          );
        }
      } else {
        setActiveSegmentIndex(index);
      }
    },
    [
      currentQueryParameters,
      customSegmentParamName,
      enableNestedSegments,
      enableSegmentRouting,
      navigate,
      nestedSegments,
      segmentParamName,
      setSearchParams,
    ],
  );

  return [segment, setSegment] as const;
}

export default useSegmentParams;
