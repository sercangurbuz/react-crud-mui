import { FieldValues, useFormState } from 'react-hook-form';

import useTranslation from '../../i18n/hooks/useTranslation';
import Alerts from '../../page/components/Alerts';
import useFormErrors from '../hooks/useFormErrors';
import useValidationOptionsContext from '../hooks/useValidationOptionsContext';

function ValidationAlerts<TFieldValues extends FieldValues>() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { t } = useTranslation();

  const { alertVisibility, fields, staticErrorMessage } =
    useValidationOptionsContext<TFieldValues>();

  const { isValid } = useFormState({
    disabled: alertVisibility !== 'static-text',
  });

  /* --------------- Get errors depending on validation options --------------- */

  let errors = useFormErrors<TFieldValues>({
    name:
      alertVisibility === 'selected-fields'
        ? fields
        : alertVisibility === 'only-unbound-fields'
          ? []
          : undefined,
    disabled: alertVisibility === 'invisible' || alertVisibility === 'static-text',
    appendUnBoundFields: true,
  });

  /* ------------------------------ Render Helper ----------------------------- */

  if (alertVisibility === 'static-text' && !isValid) {
    errors = [staticErrorMessage || t('error_message')];
  }

  return <Alerts messages={errors} defaultType="error" />;
}

export default ValidationAlerts;
