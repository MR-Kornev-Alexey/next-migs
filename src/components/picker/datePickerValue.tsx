import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue({emitDateToParent}) {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs('2024-05-01'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
  const [allPeriod, setAllPeriod] = React.useState({startDate: dayjs('2024-04-01').format('YYYY-MM-DD'), endDate: dayjs().format('YYYY-MM-DD')});
  const minDate = dayjs('2024-04-01');
  const maxDate = dayjs();

  const setFreePeriod = (flag,input) => {
    if(flag === 0){
      allPeriod.startDate = dayjs(input).format('YYYY-MM-DD')
    } else {
      allPeriod.endDate = dayjs(input).format('YYYY-MM-DD')
    }
    emitDateToParent(allPeriod)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          sx={{width: 260}}
          label="Начало периода"
          value={startDate}
          onChange={(newValue) => setFreePeriod(0,newValue)}
          minDate={minDate}
          maxDate={maxDate}
        />
        <DatePicker
          sx={{width: 260}}
          label="Конец периода"
          value={endDate}
          onChange={(newValue) => setFreePeriod(1,newValue)}
          minDate={minDate}
          maxDate={maxDate}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
