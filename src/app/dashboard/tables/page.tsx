'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {useState} from "react";
import DataTables from "@/app/dashboard/tables/data-tables";
import SelectSensorsForShow from "@/lib/common/select-sensors-for-show";

export default function Page(): React.JSX.Element {
  const [selectedRows, setSelectedRows] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  const [categories, setCategories] = useState<string[]>([]);
  const [barChart, setBarChart] = useState<string[]>([]);
  const [namesChart, setNamesChart] = useState<string[]>([]);
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Таблицы</Typography>
      </Box>

      <SelectSensorsForShow
                            sendCategories={setCategories}
                            setNamesChart={setNamesChart}
                            setBarChart={setBarChart}
                            setDataForTables={setGroupedData}
                            flag={"table"}
                            sendGroupedData={setCategories}
                            setSelectedRowsForTables={setSelectedRows}/>
      <DataTables groupedData={groupedData} selectedRows={selectedRows}/>
    </Stack>
  )
}
