import useDetailPageRouteParams from '../../../components/detail-page/hooks/useDetailPageRouteParams';
import DetailPage from '../../../components/detail-page/pages/DetailPage';
import UserOutlined from '../../../components/icons/UserOutlined';
import useAppQuery from '../../../components/query/useAppQuery';
import { ServerError } from '../../../components/utils';
import FormContent from '../../detail-page/components/FormContent';
import { handleSaveUser, UserDefaultValues } from '../../utils/api';
import { userSchema, UserSchema } from '../../utils/schema';

function NestedUserInfoRouteTab() {
  const { id, reason } = useDetailPageRouteParams();
  const { data, isLoading, error } = useAppQuery<UserSchema>({
    queryKey: ['user', id],
    url: `https://jsonplaceholder.typicode.com/users/${id}`,
    enabled: reason !== 'create',
  });

  return (
    <DetailPage.Route
      data={data}
      loading={isLoading}
      header="User Details"
      icon={<UserOutlined />}
      schema={userSchema}
      defaultValues={UserDefaultValues}
      onSave={handleSaveUser}
      error={error as ServerError}
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
