export interface ApiErrorProps {
  error: any;  // Измените тип 'any' на точный тип данных вашего ошибки от API
  setIsMessage: React.Dispatch<React.SetStateAction<string>>;
}

const handleApiError = ({ error, setIsMessage}: ApiErrorProps) => {
  console.error('Ошибка при загрузке данных:', error);
  setIsMessage('Ошибка при загрузке данных: ' + error.message);
};

export default handleApiError;
