import React from "react";

export interface ApiErrorProps {
  error: any;  // Измените тип 'any' на точный тип данных вашего ошибки от API
  setIsMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsAlert: React.Dispatch<React.SetStateAction<string>>;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setModalMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertColor: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<string>>;
}

const handleApiErrorModal = ({ error,         setModalMessage,
                               setAlertColor,
                               setIsOpen,}: ApiErrorProps) => {
  console.error('Ошибка при загрузке данных:', error);
  setAlertColor('error')
  setModalMessage('Ошибка при загрузке данных: ' + error.message);
  setIsOpen(false)
};

export default handleApiErrorModal;
