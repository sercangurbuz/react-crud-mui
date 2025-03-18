import { useEffect } from 'react';
import { FieldValues, useFormContext, useFormState } from 'react-hook-form';

import { useValidationOptionsContext } from '../../form/hooks';
import { isEmpty } from '../../misc';

function TriggerValidation<TModel extends FieldValues>() {
  const { runValidationsOnDataChange } = useValidationOptionsContext<TModel>();
  const { defaultValues } = useFormState();
  const { trigger } = useFormContext();

  useEffect(() => {
    if (!runValidationsOnDataChange) {
      return;
    }

    if (defaultValues && !isEmpty(defaultValues)) {
      void trigger();
    }
  }, [defaultValues, trigger, runValidationsOnDataChange]);

  return null;
}

export default TriggerValidation;
