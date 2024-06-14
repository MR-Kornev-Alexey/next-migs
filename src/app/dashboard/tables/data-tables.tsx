'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from "@mui/material/Box";
import SensorDataStrainGauge from "@/components/tables/sensorDataStrainGauge";
import {useEffect, useState} from "react";
import sortingSensors from "@/lib/calculate/sort-data-for-tables";
import SensorDataInclinoMeter from "@/components/tables/sensorDatainclinoMeter";


const sensorComponents = {
  strainGauge: SensorDataStrainGauge,
  inclinoMeter: SensorDataInclinoMeter,
  // Add other mappings here
};
export default function DataTables({groupedData, selectedRows}): React.JSX.Element {
  const types=['strainGauge', 'inclinoMeter', 'rangefinder', 'GNSSReceiver','temperatureSensor', 'weatherStation']
  const [sortedSensors, setSortedSensors] = useState({})
  const rows = []
  useEffect(() => {
    const sorted = sortingSensors(groupedData, selectedRows)
    setSortedSensors(sorted)
    console.log(sorted)
  }, [groupedData, selectedRows]);

  return (
    <Stack spacing={3}>
      {types.map((type, index) => {
        const SensorComponent = sensorComponents[type];
        const rows = Object.values(sortedSensors).filter(sensor => sensor.sensor_key === type);

        return (
          <Box key={index}>
            {SensorComponent && rows.length > 0 ? (
              rows.map((sensor, i) => (
                <SensorComponent key={i} rows={sensor.data} sensorInfo={  [sensor.sensor_type, sensor.model, sensor.designation]}/>
              ))
            ) : (
              // <p>No data for {type}</p>
              <></>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
