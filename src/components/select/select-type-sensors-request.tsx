import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import getUniqueModels from "@/lib/common/get- unique-models";


interface SelectTypeSensorsRequestProps {
  selectedObject: string;
  sendSelectedType:  () => void;
}

const SelectTypeSensorsRequest: React.FC<SelectTypeSensorsRequestProps> = ({ selectedObject, sendSelectedType }) => {
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const selectedSensors = allObjects.find(obj => obj.id === selectedObject)?.Sensor || [];

  const [selectedType, setSelectedType] = useState<string>('');
  const [formattedTypes, setFormattedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedSensors.length > 0) {
      const formattedTypes = getUniqueModels(selectedSensors);
      setFormattedTypes(formattedTypes);
      console.log('Formatted models: ', formattedTypes);
    }
  }, [selectedSensors]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setSelectedType(value);
    sendSelectedType(value)
    console.log(value); // This will log the selected id
  };

  const generateMenuItems = () => {
    return formattedTypes.map((model: string, index: number) => (
      <MenuItem key={index} value={model}>
        {model}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ my: 1, minWidth: 260, flexDirection: 'column' }} display="flex" justifyContent="center">
      <FormControl sx={{ width: '100%', my: 1 }} fullWidth>
        <InputLabel id="object-select-label">модель датчика</InputLabel>
        <Select
          labelId="object-select-label"
          id="object-select"
          value={selectedType}
          label="модель датчика"
          onChange={handleChange}
          fullWidth
        >
          {generateMenuItems()}
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectTypeSensorsRequest;
