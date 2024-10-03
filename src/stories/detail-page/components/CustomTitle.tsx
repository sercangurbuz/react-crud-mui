import useDetailPage from '../../../components/detail-page/hooks/useDetailPage';

function CustomTitle() {
  const { reason } = useDetailPage();

  if (reason !== 'fetch') {
    return <>New Person</>;
  }

  return <>Person Details</>;
}

export default CustomTitle;
