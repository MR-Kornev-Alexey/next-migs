'use client';
import React from 'react';
import {Box, Select, MenuItem, SelectChangeEvent} from '@mui/material';

interface Organisation {
  id: string;
  name: string;
}

interface Props {
  organisations: Organisation[];
}

const OrganisationList: React.FC<Props> = ({organisations}) => {
  const [selectedOrganisation, setSelectedOrganisation] = React.useState<string>('-1');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedOrganisation(event.target.value);
  };

  return (
    <Box>
      <Select value={selectedOrganisation} onChange={handleChange}>
        <MenuItem value="-1">Выберите организацию</MenuItem>
        {organisations.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      {selectedOrganisation}
    </Box>
  );
}

// Пример организаций
const organisations: Organisation[] = [
  {id: '1', name: 'Организация 1'},
  {id: '2', name: 'Организация 2'},
  {id: '3', name: 'Организация 3'},
];

const Example: React.FC = () => {
  return (
    <OrganisationList organisations={organisations}/>
  );
}

export default OrganisationList;
