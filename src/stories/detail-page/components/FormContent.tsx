import { useFormContext } from 'react-hook-form';

import { BusinessCenter } from '@mui/icons-material';
import { Grid2, InputAdornment } from '@mui/material';

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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessCenter />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input
              name="username"
              label="User name"
              onChange={() => void trigger()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessCenter />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input
              name="email"
              label="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessCenter />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="website" label="Web site" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Combobox
              name="website1"
              label="Web site2"
              data={[
                { id: 1, name: 'dwdw' },
                { id: 2, name: 'dwdwfe' },
                { id: 3, name: 'dwdf ew' },
              ]}
            />
          </Grid2>
        </Grid2>
      </Page.Content>
    </>
  );
}

export default FormContent;
