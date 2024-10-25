import { useCallback } from 'react';
import { FieldValues } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { CloseReason } from '../../page/Page';
import useSettings from '../../settings-provider/hooks/useSettings';
import DetailPageDefaultLayout from '../components/DetailPageDefaultLayout';
import Prompt from '../components/Prompt';
import useDetailPageRouteParams from '../hooks/useDetailPageRouteParams';
import { UseFormPromptProps } from '../hooks/useFormPrompt';
import { UseSegmentParamsOptions } from '../hooks/useSegmentParams';
import { NeedDataReason } from './DetailPageContent';
import { DataResult } from './DetailPageData';
import DetailPageForm, { DetailPageFormProps } from './DetailPageForm';

export interface DetailPageRouteProps<TModel extends FieldValues>
  extends Omit<DetailPageFormProps<TModel>, 'reason'>,
    Omit<UseSegmentParamsOptions, 'paths'> {
  enableRedirectToCreated?: boolean;
  enableRedirectToList?: boolean;
  promptOptions?: UseFormPromptProps;
  uniqueIdParamName?: string;
}

function DetailPageRoute<TModel extends FieldValues>({
  enableRedirectToCreated = true,
  enableRedirectToList = false,
  promptOptions,
  enableSegmentRouting,
  enableNestedSegments,
  fallbackSegmentIndex,
  onReasonChange,
  uniqueIdParamName,
  ...dpProps
}: DetailPageRouteProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();
  const { newItemParamValue } = useSettings();

  const { tabs, steps } = dpProps;

  /**
   * Get id from route param and determine the reason
   * Also segment index is managed by search params (tabs or steps) or matched route (nested route)
   */
  const { reason, segment, setSegment, disabled, readonly } = useDetailPageRouteParams({
    uniqueIdParamName,
    enableSegmentRouting,
    enableNestedSegments,
    fallbackSegmentIndex,
    paths: tabs ?? steps,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const handleReasonChange = (reason: NeedDataReason) => {
    if (reason === 'fetch') {
      return;
    }

    let pathname = `../${newItemParamValue}`;
    const search = new URLSearchParams();

    if (enableNestedSegments) {
      pathname = `../${pathname}`;
    }

    if (reason === 'copy') {
      search.set('copy', '');
      pathname = './';
    }

    navigate(
      {
        pathname,
        search: search.toString(),
      },
      { relative: 'path' },
    );

    onReasonChange?.(reason);
  };

  const handleClose = (reason?: CloseReason) => {
    navigate(enableNestedSegments ? '../../' : '../', {
      state: { noBlock: reason === 'action' },
      relative: 'path',
    });
  };

  const handleAfterSave = (data: Awaited<DataResult<TModel>>) => {
    if (enableRedirectToCreated && reason !== 'fetch' && data?.id) {
      let pathname = `../${data.id}`;

      if (enableNestedSegments) {
        pathname = `../${pathname}`;
      }
      /**
       * Navigate created item if enabled
       */
      navigate(pathname, { state: { noBlock: true }, relative: 'path' });
    }
  };

  const handleAfterDelete = () => {
    if (enableRedirectToList) {
      let pathname = `../`;

      if (enableNestedSegments) {
        pathname = `../${pathname}`;
      }
      /**
       * Navigate list page
       */
      navigate(pathname, { state: { noBlock: true }, relative: 'path' });
    }
  };

  return (
    <DetailPageForm
      reason={reason}
      onReasonChange={handleReasonChange}
      onAfterSave={handleAfterSave}
      onAfterDelete={handleAfterDelete}
      onClose={handleClose}
      activeSegmentIndex={segment}
      onSegmentChanged={setSegment}
      onContentLayout={(props) => (
        <>
          {/* Show prompt (confirm) when form is in dirty state while changing route */}
          <Prompt {...promptOptions} />
          <DetailPageDefaultLayout {...props} />
        </>
      )}
      disabled={disabled || readonly}
      {...dpProps}
    />
  );
}

DetailPageRoute.useDetailPageRouteParams = useDetailPageRouteParams;

export default DetailPageRoute;
