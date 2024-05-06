import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { sensorsClient } from "@/lib/sensors/sensors-client";

export function SignUpFormImportSensors({ onRegistrationSensorSuccess, closeModal, objects, typesSensors }): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [isCheckMessage, setIsCheckMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('');
  const [alertCheckColor, setAlertCheckColor] = React.useState<string>('');
  const [csvData, setCSVData] = React.useState<any>(null); // Состояние для хранения данных CSV файла

  const schema = zod.object({
    object_id: zod.string().min(1, { message: 'Ввод объекта обязателен' }),
  });

  type Values = zod.infer<typeof schema>;
  const defaultValues = {
    object_id: '',
  } satisfies Values;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsMessage("");
      setIsPending(true);
      let result;
      try {
        if (csvData) {
          result = await sensorsClient.importNewSensorsToObject(values, csvData);
          console.log("Данные из CSV:", csvData);
        } else {
          throw new Error("Данные CSV файла не найдены.");
        }
      } catch (error) {
        console.error("Произошла ошибка при отправке данных на сервер:", error);
        setAlertColor("error");
        setIsMessage("Произошла ошибка при отправке данных на сервер");
      }

      if (result?.data?.statusCode === 200) {
        setAlertColor("success");
        setIsMessage(result?.data?.message);
        // onRegistrationSensorSuccess(result?.data);
      } else {
        setAlertColor("error");
        setIsMessage(result?.data?.message || "Произошла ошибка обработки данных");
      }

      setTimeout(() => {
        setIsPending(false);
        closeModal(false)
      }, 2000);
    },
    [csvData]
  );

  const objectOptions = objects.map(user => ({
    value: user.id,
    label: user.name
  }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const parsedData = await parseAndCheckCSV(file);
        setCSVData(parsedData.data); // Сохраняем данные CSV файла в состоянии
        setAlertCheckColor("success");
        setIsCheckMessage("CSV файл успешно загружен и обработан.");
      } catch (error) {
        console.error("Ошибка при обработке CSV файла:", error);
        setAlertCheckColor("error");
        setIsCheckMessage("Ошибка при обработке CSV файла.");
      }
    }
  };

  const parseAndCheckCSV = (file: File) => {
    return new Promise<{ isValid: boolean; data: any[] }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          const rows = csvData.split("\n");
          const headers = rows[0].split(","); // Первая строка файла CSV как заголовки
          const data = [];
          let isValidCSV = true;

          // Удаляем пустые строки, если они есть
          const filteredRows = rows.filter(row => row.trim() !== '');

          // Проверяем каждую строку на количество полей
          const invalidRows = filteredRows.filter(row => {
            const fields = row.split(",");
            if (fields.length !== 5) {
              isValidCSV = false;
              return true;
            }
            return false;
          });

          if (invalidRows.length === 0) {
            // Если все строки имеют правильное количество полей, преобразуем их в объекты данных
            for (let i = 1; i < filteredRows.length; i++) {
              const row = filteredRows[i].split(",");
              data.push(row);
            }

            console.log(data);
            resolve({ isValid: true, data });
          } else {
            // Если найдены строки с неправильным количеством полей, генерируем ошибку
            isValidCSV = false;
            reject(`Найдены строки с неправильным количеством полей: ${invalidRows.join(", ")}`);
          }
        } catch (error) {
          console.error("Ошибка при обработке CSV:", error);
          reject("Ошибка при обработке CSV");
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <Stack spacing={3}>
      <input type="file" onChange={handleFileChange} />
      {isCheckMessage && <Alert color={alertCheckColor}>{isCheckMessage}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="object_id"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.object_id)}>
                <InputLabel id="select-label">Выберите объект установки</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="-1">
                    Выберите организацию
                  </MenuItem>
                  {objectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.object_id ? <FormHelperText>{errors.object_id.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{ my: 1 }}>
            {isPending ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                      opacity={0.25}></path>
                <path fill="currentColor"
                      d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
                                    values="0 12 12;360 12 12"></animateTransform>
                </path>
              </svg>
            ) : (
              <Box>
                Добавить
              </Box>
            )}
          </Button>
          {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
        </Stack>
      </form>
    </Stack>
  );
}
