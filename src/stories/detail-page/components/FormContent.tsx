import { useFormContext } from 'react-hook-form';

import { Grid2 } from '@mui/material';

import Field from '../../../components/form/Field';
import Page from '../../../components/page/Page';

interface FormContentProps {}

function FormContent(props: FormContentProps) {
  const { trigger } = useFormContext();
  return (
    <>
      <Page.Content>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" onChange={() => trigger()} />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
        </Grid2>
        boo
      </Page.Content>
    </>
  );
}

export default FormContent;
