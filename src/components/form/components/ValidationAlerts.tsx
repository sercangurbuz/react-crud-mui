import { FieldValues } from 'react-hook-form';

import Alerts from '../../page/components/Alerts';
import useFormErrors from '../hooks/useFormErrors';
import useValidationOptionsContext from '../hooks/useValidationOptionsContext';

function ValidationAlerts<TFieldValues extends FieldValues>() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { alertVisibility, fields } = useValidationOptionsContext<TFieldValues>();

  /* --------------- Get errors depending on validation options --------------- */

  const errors = useFormErrors<TFieldValues>({
    name:
      alertVisibility === 'selected-fields'
        ? fields
        : alertVisibility === 'only-unbound-fields'
          ? []
          : undefined,
    disabled: alertVisibility === 'invisible',
    appendUnBoundFields: true,
  });

  /* ------------------------------ Render Helper ----------------------------- */

  return <Alerts messages={errors} defaultType="error" />;
}

export default ValidationAlerts;
