const handleApiResponse = ({ result, successCallback, setAlertColor, setIsMessage, setIsOpenModal }) => {
  switch (result?.data?.statusCode) {
    case 200:
      setAlertColor('success');
      setIsMessage(result?.data?.message);
      successCallback(result);
      setIsOpenModal(false);
      break;
    case 400:
    case 500:
      setAlertColor('error');
      setIsMessage(result?.data?.message);
      break;
    default:
      setAlertColor('error');
      setIsMessage(result?.error?.message || 'Произошла ошибка');
      break;
  }
};

export default handleApiResponse;
