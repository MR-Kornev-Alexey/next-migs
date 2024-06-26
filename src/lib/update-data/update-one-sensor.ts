const useUpdateSensor = (updatedSensor: any, allSensors: any) => {
  // Копируем массив всех датчиков
  let updatedAllSensors = [...allSensors];

  // Находим индекс датчика
  const sensorIndex = updatedAllSensors.findIndex(sensor => sensor.id === updatedSensor.id);

  if (sensorIndex !== -1) {
    // Если найден, обновляем данные датчика
    updatedAllSensors[sensorIndex] = updatedSensor;
  } else {
    // Если не найден, добавляем новый датчик
    updatedAllSensors.push(updatedSensor);
  }

  return updatedAllSensors;
};

export default useUpdateSensor;
