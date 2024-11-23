import { Grid2 } from '@mui/material';

import Field from '../../../components/form/Field';
import Page from '../../../components/page/Page';

function FilterContent() {
  return (
    <>
      <Page.Content>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="name" label="Name" autoFocus />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.PhoneInput name="phone" label="Phone" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Search name="search" />
          </Grid2>
        </Grid2>
      </Page.Content>
    </>
  );
}

export default FilterContent;
