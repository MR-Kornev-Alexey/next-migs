import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  FormHelperText
} from '@mui/material';
import UnitOfMeasurement from "@/lib/common/unitOfMeasurement";

const SensorDataForm = ({ sensorType, model }) => {
  const { control, formState: { errors } } = useForm();

  // Функция для получения массива значений name_unit и value для данного датчика и модели
  const getUnitValues = () => {
    let selectedSensor;
    // Проходим по всем ключам в объекте UnitOfMeasurement
    for (const key in UnitOfMeasurement) {
      // Находим датчик с соответствующим типом (sensorType)
      if (UnitOfMeasurement[key].some(sensor => sensor.type === sensorType)) {
        selectedSensor = UnitOfMeasurement[key];
        break; // Если найден, прекращаем поиск
      }
    }

    // Если найден соответствующий датчик, ищем соответствующую модель
    if (selectedSensor) {
      const selectedModel = selectedSensor.find(item => item.model === model);
      // Если модель найдена, возвращаем ее значения name_unit и value
      return selectedModel ? selectedModel.name_unit.map((unit, index) => ({
        name_unit: unit,
        value: selectedModel.value[index]
      })) : [];
    }

    return [];
  };

  return (
    <form>
      <Controller
        control={control}
        name="unit_of_measurement"
        render={({ field }) => (
          <FormControl error={Boolean(errors.unit_of_measurement)} sx={{width: '96%'}}>
            <InputLabel>Введите единицу измерения</InputLabel>
            <Select {...field} label="Введите единицу измерения">
              {getUnitValues().map((unit, index) => (
                <MenuItem key={index} value={unit.value}>{unit.name_unit}</MenuItem>
              ))}
            </Select>
            {errors.unit_of_measurement ? <FormHelperText>{errors.unit_of_measurement.message}</FormHelperText> : null}
          </FormControl>
        )}
      />
    </form>
  );
};

export default SensorDataForm;

