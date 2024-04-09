'use client';
import React from 'react';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Organisation {
  id: string;
  name: string;
}

interface Props {
  organisations: Organisation[];
  onSelectOrganisation: (organisationId: string) => void; // Функция обратного вызова для выбора организации
}

const OrganisationList: React.FC<Props> = ({ organisations, onSelectOrganisation }) => {
  const [selectedOrganisation, setSelectedOrganisation] = React.useState<string>('-1');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedOrgId = event.target.value;
    setSelectedOrganisation(selectedOrgId);
    onSelectOrganisation(selectedOrgId); // Вызываем функцию обратного вызова с выбранной организацией
  };

  return (
    <Box>
      <Select value={selectedOrganisation} onChange={handleChange} sx={{width: "99%"}}>
        <MenuItem value="-1">Выберите организацию</MenuItem>
        {organisations.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default OrganisationList;

