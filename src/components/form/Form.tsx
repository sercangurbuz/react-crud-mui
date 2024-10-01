import { DetailedHTMLProps, FormHTMLAttributes, PropsWithChildren } from 'react';

import FormDisabledProvider from './components/FormDisabledProvider';

interface FormProps
  extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  disabled?: boolean;
}

function Form(props: FormProps) {
  return (
    <FormDisabledProvider disabled={props?.disabled}>
      <form {...props} />
    </FormDisabledProvider>
  );
}

Form.Disabled = FormDisabledProvider;

export default Form;
