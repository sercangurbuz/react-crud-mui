/* eslint-disable @typescript-eslint/no-unsafe-call */
import useDetailPageRouteParams from '../../../components/detail-page/hooks/useDetailPageRouteParams';
import DetailPage from '../../../components/detail-page/pages/DetailPage';
import UserOutlined from '../../../components/icons/UserOutlined';
import FormContent from '../../detail-page/components/FormContent';
import { handleSaveUser, useFetchUserById, UserDefaultValues } from '../../utils/api';
import { userSchema } from '../../utils/schema';

function NestedUserInfoRouteTab() {
  const { id } = useDetailPageRouteParams();
  const [data, loading] = useFetchUserById(id);

  return (
    <DetailPage.Route
      data={data}
      loading={loading}
      header="User Details"
      icon={<UserOutlined />}
      schema={userSchema}
      defaultValues={UserDefaultValues}
      onSave={handleSaveUser}
      enableNestedSegments
      tabs={[
        {
          label: 'Person Info',
          key: 'info',
          value: 'info',
        },
        {
          label: 'Additional Info',
          key: 'todos',
          value: 'todos',
        },
      ]}
    >
      <FormContent />
    </DetailPage.Route>
  );
}

export default NestedUserInfoRouteTab;
