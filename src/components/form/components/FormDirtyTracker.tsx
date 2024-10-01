import { useEffect } from 'react';
import { useFormState } from 'react-hook-form';

interface FormDirtyTrackerProps {
  onDirtyStateChange(isDirty: boolean): void;
}

function FormDirtyTracker({ onDirtyStateChange }: FormDirtyTrackerProps) {
  const { isDirty } = useFormState();

  useEffect(() => {
    onDirtyStateChange(isDirty);
  }, [isDirty, onDirtyStateChange]);

  return null;
}

export default FormDirtyTracker;
