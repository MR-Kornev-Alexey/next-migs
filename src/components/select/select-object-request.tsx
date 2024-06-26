import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from "react";
import setTitleAllObjects from "@/lib/common/set-title-all-objects";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

interface FormattedObject {
  displayName: string;
  id: string;
}
const SelectObjectRequest: React.FC = ({sendSelectedObject}) => {
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [formattedObjects, setFormattedObjects] = useState<string[]>([]);

  useEffect(() => {
    const formattedObjects = setTitleAllObjects(allObjects);
    setFormattedObjects(formattedObjects);
    console.log('Formatted objects: ', formattedObjects);
  }, [allObjects]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setSelectedObject(value);
    sendSelectedObject(value)
    console.log(value); // This will log the selected id
  };

  const generateMenuItems = () => {
    return formattedObjects.map((obj: FormattedObject, index: number) => (
      <MenuItem key={index} value={obj.id}>
        {obj.displayName}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ my: 1, minWidth: 260, flexDirection: 'column' }} display="flex" justifyContent="center">
      <FormControl sx={{ width: '100%', my: 1}} fullWidth>
        <InputLabel id="object-select-label">объект</InputLabel>
        <Select
          labelId="object-select-label"
          id="object-select"
          value={selectedObject}
          label="объект"
          onChange={handleChange}
          fullWidth
        >
          {generateMenuItems()}
        </Select>
      </FormControl>
    </Box>

  );
}

export default SelectObjectRequest;
