export const handleResponse = (result: any, setAlertColor: Function, setIsMessage: Function, successOfDownload:Function, closeModal: Function) => {
  switch (result?.data?.statusCode) {
    case 200:
      setAlertColor("success");
      setIsMessage(result?.data?.message);
      successOfDownload(result?.data)
      setTimeout(() => {
        closeModal(false); // Закрываем модальное окно после успешного добавления
      }, 2000);
      break;
    case 400:
    case 500:
      setAlertColor("error");
      setIsMessage(result?.data?.message);
      break;
    default:
      // Обрабатываем ошибку
      setAlertColor("error");
      setIsMessage(result?.error?.message || "Произошла ошибка");
      break;
  }
};
