import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import dayjs, { Dayjs } from 'dayjs';
import DatePickerValue from "@/components/picker/datePickerValue";
import {useState} from "react";

interface Period {
  startDate: Dayjs;
  endDate: Dayjs;
}
export default function SelectTimePeriod({setPeriodToParent}) {
  const [period, setPeriod] = React.useState('');
  const [showSelfPicker, setShowSelfPicker] = useState<boolean>(false);

  const handleChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value as string);
    if(event.target.value === 'self'){
      setShowSelfPicker(true)
      setPeriodToParent({startDate: dayjs('2024-04-01').format('YYYY-MM-DD'), endDate: dayjs().format('YYYY-MM-DD')})
    } else {
      setShowSelfPicker(false)
      setPeriodUp(event.target.value as string)
    }
  };


  const setPeriodUp = (selectedPeriod: string) => {
    let period: Period;

    switch (selectedPeriod) {
      case "day":
        period = {
          startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          endDate: dayjs().add(1, 'day').format('YYYY-MM-DD')
        };
        break;
      case "week":
        period = {
          startDate: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
          endDate: dayjs().add(1, 'day').format('YYYY-MM-DD')
        };
        break;
      case "month":
        period = {
          startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
          endDate: dayjs().add(1, 'day').format('YYYY-MM-DD')
        };
        break;
      default:
        period = {
          startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          endDate: dayjs().add(1, 'day').format('YYYY-MM-DD')
        };
    }
    setPeriodToParent(period);
  };
  return (
    <Box sx={{ my: 2, minWidth: 260, flexDirection: 'column'}} display="flex" justifyContent="center">
      <FormControl sx={{width: 260, my: 2}}>
        <InputLabel id="demo-simple-select-label">Период</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={period}
          label="Период"
          onChange={handleChange}
        >
          <MenuItem value={'day'}>Текущий день</MenuItem>
          <MenuItem value={'week'}>Последняя неделя</MenuItem>
          <MenuItem value={'month'}>Последний месяц</MenuItem>
          <MenuItem value={'self'}>Самостоятельный ввод</MenuItem>
        </Select>
      </FormControl>
      {showSelfPicker&&<DatePickerValue emitDateToParent={setPeriodToParent}/>}
    </Box>
  );
}
