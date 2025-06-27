import { useWatch } from 'react-hook-form';

import Grid2 from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Field from '../../../components/form/Field';
import Page from '../../../components/page/Page';
import { StepSchema } from '../../utils/schema';

function Step1() {
  return (
    <Page.Content>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 4, xs: 12 }}>
          <Field.Input name="name" label="Name" autoFocus />
        </Grid2>
        <Grid2 size={{ md: 8, xs: 12 }}>
          <Field.Input name="username" label="Full Name" />
        </Grid2>
      </Grid2>
    </Page.Content>
  );
}

function Step2() {
  return (
    <Page.Content>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 4, xs: 12 }}>
          <Field.Input name="email" label="Email" autoFocus />
        </Grid2>
        <Grid2 size={{ md: 4, xs: 12 }}>
          <Field.PhoneInput name="phone" label="Phone" />
        </Grid2>
        <Grid2 size={{ md: 4, xs: 12 }}>
          <Field.Input name="website" label="WebSite" />
        </Grid2>
      </Grid2>
    </Page.Content>
  );
}

function Step3() {
  const { contact, main } = useWatch<StepSchema>();

  return (
    <List dense>
      <ListItem>
        <ListItemText primary={main?.name} secondary="Name" />
      </ListItem>
      <ListItem>
        <ListItemText primary={main?.username} secondary="User name" />
      </ListItem>
      <ListItem>
        <ListItemText primary={contact?.email} secondary="Email" />
      </ListItem>
      <ListItem>
        <ListItemText primary={contact?.phone} secondary="Phone" />
      </ListItem>
      <ListItem>
        <ListItemText primary={contact?.website} secondary="Website" />
      </ListItem>
    </List>
  );
}

export { Step1, Step2, Step3 };
