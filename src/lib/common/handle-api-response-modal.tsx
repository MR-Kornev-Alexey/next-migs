const handleApiResponseModal = ({ result, successCallback, setAlertColor, setIsMessage, closeModal }) => {
  switch (result?.data?.statusCode) {
    case 200:
      setAlertColor('success');
      setIsMessage(result?.data?.message);
      successCallback(result);
      closeModal(false)
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

export default handleApiResponseModal;
