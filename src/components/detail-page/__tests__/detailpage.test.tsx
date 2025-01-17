import Input from '@mui/material/Input';
import { describe, expect, test } from 'vitest';

import { renderWithAct, screen } from '../../../test-setup/test-utils';
import Field from '../../form/Field';
import DetailPage from '../pages/DetailPage';

const Content: React.FC = () => {
  return <Field name="name" render={(props) => <Input placeholder="ph" {...props} />}></Field>;
};

describe('DetailPage', () => {
  describe('DetailPage - form content render', () => {
    test('should render children function properly', async () => {
      await renderWithAct(
        <DetailPage>
          <Content />
        </DetailPage>,
      );

      expect(screen.getByPlaceholderText('ph')).toBeInTheDocument();
    });
  });
});
