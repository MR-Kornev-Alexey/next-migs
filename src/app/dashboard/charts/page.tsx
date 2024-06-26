'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useCallback, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";

const LineWithNullPlot = dynamic(() => import('@/lib/apexcharts/chart-with-null'), {
  ssr: false
});
const BarsChartCommon = dynamic(() => import('@/lib/apexcharts/bars-chart-common'), {
  ssr: false
});
import {calculateDistance} from "@/lib/calculate/calculate-distance";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";
import SelectSensorsForShow from "@/lib/common/select-sensors-for-show";
import formatDateTime from "@/lib/common/formatDateTime";
import getRandomColor from "@/lib/calculate/get-random-сolor";
import ModalLoading from "@/components/modal/modal-loading";
import Button from "@mui/material/Button";
import Sensor from "@/types/sensor"
import {Alert, Grid} from "@mui/material";


interface Sensor {
  requestSensorInfo: {
    id: number;
    sensor_id: string;
    periodicity: number;
    request_code: string;
    logical_zero: any;
    add_zero: any;
    min: number | null;
    max: number | null;
    base_value: any;
    last_value: any;
    warning: boolean;
    base_zero: number;
  }[];
  name: string;
  id: string;
  sensor_id: string;
  designation: string;
  network_number: number;
  model: string;
  data: string[];
}

export default function Page(): React.JSX.Element {
  const [groupedData, setGroupedData] = useState<Sensor[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [barChart, setBarChart] = useState<string[]>([]);
  const [namesChart, setNamesChart] = useState<string[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  let [isShowCharts, setIsShowCharts] = useState<boolean>(true);
  const [alertColor, setAlertColor] = useState<string>('');
  const [isMessage, setIsMessage] = useState<string>('');
  const colorMap = useRef({});
  const childRef = useRef<{ customMethod: (data) => void }>(null);
  const onClose = () => {
    setIsOpenModal(false)
  }
  const updateValues = (data) => {
    if (childRef.current) {
      childRef.current.customMethod(data);
    }
  };
  const processData = useCallback((receivedData) => {
    setGroupedData((prevGroupedData) => {
      const sensor = prevGroupedData.find(s => s.sensor_id === receivedData.sensor_id);
      console.log('sensor ----', sensor)
      if (sensor) {
        console.log('Sensor найден');
        let newData;
        let lastValueX;
        let lastValueY;
        let zero = sensor.requestSensorInfo[0].base_zero
        if (sensor.model === 'ИН-Д3') {
          const parsedData = parseSensorInD3(receivedData.answer_code);
          lastValueX = parsedData.angleX;
          lastValueY = parsedData.angleY;
          newData = {
            x: formatDateTime(receivedData.created_at),
            y: parseFloat((calculateDistance(lastValueX, lastValueY) - zero).toFixed(2))
          };
        } else if (sensor.model === 'РФ-251') {
          const parsedData = parseSensorRf251(receivedData.answer_code);
          newData = {
            x: formatDateTime(receivedData.created_at),
            y: parseFloat((parsedData.distance - zero).toFixed(2))
          };
        }

        const updatedSensors = prevGroupedData.map(s =>
          s.sensor_id === sensor.sensor_id
            ? {...s, data: [...s.data, newData]}
            : s
        );

        const seriesBars = {
          name: '',
          data: updatedSensors.map(s => s.data[s.data.length - 1]?.y || 0)
        };
        const names = updatedSensors.map(s => `${s.name}`);
        setBarChart([seriesBars]);
        setNamesChart(names)
        console.log('Names:', names);
        console.log('seriesBars:', seriesBars);
        return updatedSensors;
      } else {
        console.log('Sensor не найден');
        return prevGroupedData;
      }
    });
  }, [setGroupedData, setBarChart]);

  useEffect(() => {
    const lastValues = new EventSource('http://localhost:5000/sse/last_value');
    lastValues.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('lastValues --', data);
      updateValues(data)
    };

    const eventSource = new EventSource('http://localhost:5000/sse/events');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('eventSource --', data);
      processData(data);
    };

    return () => {
      eventSource.close();
      lastValues.close();
    };
  }, [processData, updateValues]);

  const assignColorsToSensors = (data) => {
    return data.map(sensor => {
      if (!colorMap.current[sensor.sensor_id]) {
        colorMap.current[sensor.sensor_id] = getRandomColor();
      }
      return {
        ...sensor,
        color: colorMap.current[sensor.sensor_id],
      };
    });
  };

  const seriesData = assignColorsToSensors(groupedData).map(sensor => ({
    name: sensor.name,
    data: sensor.data,
    color: sensor.color,
  }));

  const toggleShowCharts = () => {
    setIsShowCharts(isShowCharts = !isShowCharts)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Графики</Typography>
      <Box>
        <SelectSensorsForShow sendGroupedData={setGroupedData}
                              sendCategories={setCategories}
                              setNamesChart={setNamesChart}
                              setBarChart={setBarChart}
                              setGroupedData={setGroupedData}
                              ref={childRef}/>
        <Box>
          {barChart.length > 0 &&
            <Box>
              <BarsChartCommon barChart={barChart} namesChart={namesChart}/>
            </Box>
          }
          <Grid container spacing={2} sx={{marginTop: 2}}>
            <Grid item xs={12} md={6}>
              {seriesData.length > 0 &&
                <Button variant="contained" sx={{width: 220, marginY: 2}}
                        onClick={() => toggleShowCharts()}>{isShowCharts ?
                  <span>Скрыть графики</span> :
                  <span>Отобразить графики</span>}</Button>
              }
            </Grid>
          </Grid>

          {isShowCharts && <Box>
            {seriesData.map((sensor, index) => (
              <Box key={`${sensor.name}-${index}`}>
                <LineWithNullPlot seriesDistance={[sensor]} title={sensor.name} color={sensor.color}
                                  categories={categories}/>
              </Box>
            ))}
          </Box>
          }
        </Box>

      </Box>
      <ModalLoading isOpen={isOpenModal} onClose={onClose}/>
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
    </Stack>
  );
}
