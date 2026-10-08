import { FieldValues } from 'react-hook-form';

import { Action } from '../../action-table/ActionTable';
import DetailPageDefaultLayout from '../components/DetailPageDefaultLayout';
import Prompt from '../components/Prompt';
import useDetailPageRouteParams from '../hooks/useDetailPageRouteParams';
import { UseFormPromptProps } from '../hooks/useFormPrompt';
import { SegmentModel } from '../hooks/useMatchedSegment';
import { UseSegmentParamsOptions } from '../hooks/useSegmentParams';
import DetailPageForm, { DetailPageFormProps } from './DetailPageForm';

export interface DetailPageRouteProps<TModel extends FieldValues = FieldValues>
  extends Omit<DetailPageFormProps<TModel>, 'reason'>,
    Omit<UseSegmentParamsOptions, 'paths'> {
  promptOptions?: UseFormPromptProps;
  uniqueIdParamName?: string;
  onNavigateRoute?: (action: Action, model: TModel | undefined, defaultPath: string) => string;
}

function DetailPageRoute<TModel extends FieldValues>({
  enableNestedSegments,
  enableSegmentRouting,
  fallbackSegmentIndex,
  promptOptions,
  uniqueIdParamName,
  ...dpProps
}: DetailPageRouteProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { tabs, steps } = dpProps;

  /**
   * Get id from route param and determine the reason
   * Also segment index is managed by search params (tabs or steps) or matched route (nested route)
   */
  const { reason, segment, setSegment } = useDetailPageRouteParams({
    uniqueIdParamName,
    enableSegmentRouting,
    enableNestedSegments,
    fallbackSegmentIndex,
    paths: (tabs ?? steps) as SegmentModel[],
  });

  return (
    <DetailPageForm
      reason={reason}
      activeSegmentIndex={segment}
      onSegmentChanged={setSegment}
      onContentLayout={(props) => (
        <>
          {/* Show prompt (confirm) when form is in dirty state while changing route */}
          <Prompt {...promptOptions} />
          <DetailPageDefaultLayout {...props} />
        </>
      )}
      {...dpProps}
    />
  );
}

DetailPageRoute.useDetailPageRouteParams = useDetailPageRouteParams;

export default DetailPageRoute;
