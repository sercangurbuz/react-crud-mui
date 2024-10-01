import { FieldValues } from 'react-hook-form';

import Alerts from '../../page/components/Alerts';
import useFormErrors from '../hooks/useFormErrors';

function ValidationAlerts<TFieldValues extends FieldValues>() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  /* --------------- Get errors depending on validation options --------------- */

  const errors = useFormErrors<TFieldValues>({
    appendUnBoundFields: true,
  });

  /* ------------------------------ Render Helper ----------------------------- */

  return <Alerts messages={errors} />;
}

export default ValidationAlerts;
