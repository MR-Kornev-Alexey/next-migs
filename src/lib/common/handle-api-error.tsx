export interface ApiErrorProps {
  error: any;  // Измените тип 'any' на точный тип данных вашего ошибки от API
  setIsMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleApiError = ({ error, setIsMessage, setIsOpenModal }: ApiErrorProps) => {
  console.error('Ошибка при загрузке данных:', error);
  setIsMessage('Ошибка при загрузке данных: ' + error.message);
  setIsOpenModal(false);
};

export default handleApiError;
