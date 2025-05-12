import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';

import Field from '../../../components/form/Field';
import useListPage from '../../../components/list-page/hooks/useListPage';
import Page from '../../../components/page/Page';

function FilterContent({ useHook }: { useHook?: boolean }) {
  const { search } = useListPage();
  return (
    <>
      <Page.Content>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Search name="name"  autoFocus />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="username" label="User name" />
          </Grid2>
          <Grid2 size={{ md: 4, xs: 12 }}>
            <Field.Input name="email" label="Email" />
          </Grid2>
        </Grid2>
        {useHook && (
          <Button sx={{ mt: 3 }} onClick={() => search()}>
            Call search from hook
          </Button>
        )}
      </Page.Content>
    </>
  );
}

export default FilterContent;
