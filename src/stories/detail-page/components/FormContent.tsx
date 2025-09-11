import { useFormContext } from 'react-hook-form';

import Grid2 from '@mui/material/Grid2';

import Field from '../../../components/form/Field';
import Page from '../../../components/page/Page';

function FormContent() {
  const { trigger } = useFormContext();

  return (
    <>
      <Page.Content>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input
              name="name"
              label="Name"
              autoFocus
              onChange={() => void trigger()}
              caseType="firstUpper"
            />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => void trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input
              name="email"
              label="Email"
              fieldProps={{
                validationMode: 'onBlur',
              }}
            />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>

          {/*      <Field.With prefix="address">
            <Field.Input name="city" label="City" />
            <Field.Input name="street" label="Street" />
            <Field.Input name="suit" label="Suite" />
          </Field.With> */}
        </Grid2>
      </Page.Content>
    </>
  );
}

export default FormContent;
