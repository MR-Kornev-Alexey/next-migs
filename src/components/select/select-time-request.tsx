import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState, useEffect } from "react";

export default function SelectTimeRequest({ setNumberToParent, defaultValueTimeRequest}) {
  const defaultValue = 10000;
  const [period, setPeriod] = useState(defaultValue);

  useEffect(() => {
    setNumberToParent(defaultValue);
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setPeriod(value);
    setNumberToParent(value);
  };

  const generateMenuItems = () => {
    const items = [];
    for (let value = 1000; value <= 20000; value += 1000) {
      items.push(
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      );
    }
    return items;
  };

  return (
    <Box sx={{ my: 2, minWidth: 260, flexDirection: 'column' }} display="flex" justifyContent="center">
      <FormControl sx={{ width: '100%', my: 2 }} fullWidth>
        <InputLabel id="period-select-label">Периодичность(мс)</InputLabel>
        <Select
          labelId="period-select-label"
          id="period-select"
          value={period}
          label="Периодичность"
          onChange={handleChange}
        >
          {generateMenuItems()}
        </Select>
      </FormControl>
    </Box>
  );
}
