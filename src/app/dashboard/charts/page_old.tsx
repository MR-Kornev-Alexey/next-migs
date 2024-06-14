'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import dynamic from 'next/dynamic';
import {Sensor} from "@/types/sensor";
import hexStringToBuffer from "@/lib/calculate/hex-string-to-buffer";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";
import PolarScatterChart from "@/lib/apexcharts/polars-scatter-chart";
import BubbleChart from "@/lib/apexcharts/bubble-chart";
import {calculateDistance} from "@/lib/calculate/calculate-distance";


// Dynamically import the ScatterPlot component with no SSR
const ScatterPlot = dynamic(() => import('@/lib/apexcharts/scatter-plot'), {
  ssr: false
});
const LineColumnPlot = dynamic(() => import('@/lib/apexcharts/line-column'), {
  ssr: false
});
const LineInD3 = dynamic(() => import('@/lib/apexcharts/line-in-d3'), {
  ssr: false
});

function findSensorById(sensors: Sensor[], id: string): Sensor | undefined {
  return sensors.find(sensor => sensor.id === id);
}

export default function Page_old() {
  const allSensors = useSelector((state: RootState) => state.allSensors.value[0]);
  const [seriesInD3, setSeriesInD3] = useState([]);
  const [seriesDistance, setSeriesDistance] = useState([]);
  const [seriesRF251, setSeriesRF251] = useState([]);

  function convertReceivedData(code, model) {
    switch (model) {
      case 'ИН-Д3':
        return [
          [parseSensorInD3(code).angleX, parseSensorInD3(code).angleY]
        ];
      case 'РФ-251':
        return [
          [
            {
              name: 'Отклонение',
              type: 'column',
              data: [parseSensorRf251(code).distance]
            },
            {
              name: 'Температура',
              type: 'line',
              data: [parseSensorRf251(code).temperature]
            }
          ]
        ];
    }
  }

// Функция для удаления старого объекта с данным sensor_id
  function removeOldData(series, sensorId) {
    const index = series.findIndex(dataPoint => dataPoint.sensor_id === sensorId);
    if (index !== -1) {
      series.splice(index, 1);
    }
  }

// Функция для обработки полученных данных
  async function processData(receivedData) {
    // Найти соответствующий датчик по ID
    const sensor = allSensors.find(s => s.id === receivedData.sensor_id);

    // Если датчик найден
    if (sensor) {
      // Создание нового объекта данных
      const dataPoint = {
        name: sensor.designation + ' ' + sensor.network_number,
        network_number: sensor.network_number,
        data: convertReceivedData(receivedData.answer_code, sensor.model),
        sensor_id: receivedData.sensor_id // Добавляем sensor_id для последующего удаления
      };

      // В зависимости от модели датчика удаляем старый объект и добавляем новый
      if (sensor.model === 'ИН-Д3') {

        setSeriesInD3(prevSeries => {
          const updatedSeries = [...prevSeries];
          removeOldData(updatedSeries, receivedData.sensor_id);
          updatedSeries.push(dataPoint);
          return updatedSeries;
        });
        setSeriesDistance(prevSeries => {
          const updatedSeries = [...prevSeries];
          const newData= calculateDistance(parseSensorInD3(receivedData.answer_code).angleX, parseSensorInD3(receivedData.answer_code).angleY)
          updatedSeries.push(newData);
          return updatedSeries;
        });

      } else if (sensor.model === 'РФ-251') {
        const parsedData = parseSensorRf251(receivedData.answer_code);
        setSeriesRF251(prevSeries => {
          const updatedSeries = [...prevSeries];
          let sensorSeries = updatedSeries.find(series => series.sensor_id === receivedData.sensor_id);

          if (!sensorSeries) {
            sensorSeries = {
              sensor_id: receivedData.sensor_id,
              name: `${sensor.designation} ${sensor.network_number}`,
              data: {
                'Отклонение': [],
                'Температура': []
              }
            };
            updatedSeries.push(sensorSeries);
          }

          sensorSeries.data['Отклонение'].push(parsedData.distance);
          sensorSeries.data['Температура'].push(parsedData.temperature);

          return updatedSeries;
        });
      }
    }
  }

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/sse/events');
    eventSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      // console.log('data --', data);
      await processData(data);
    };

    return () => {
      eventSource.close();
    };
  }, [allSensors]);


  const formattedSeriesRF251 = seriesRF251.reduce((acc, sensorData) => {
    acc.push(
      {name: `${sensorData.name} Отклонение`, type: 'column', data: sensorData.data['Отклонение']},
      {name: `${sensorData.name} Температура`, type: 'line', data: sensorData.data['Температура']}
    );
    return acc;
  }, []);
  const data = [
    {x: 5, y: 20, r: 5},
    {x: 15, y: 10, r: 10},
    {x: 20, y: 30, r: 25},
    {x: 25, y: 25, r: 5},
    {x: 30, y: 40, r: 20},
  ];
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Графики</Typography>
      </div>
      <LineInD3 seriesDistance={seriesDistance} title={"Инклинометры"}/>
      {/*<BubbleChart data={data} />*/}
      <ScatterPlot seriesInD3={seriesInD3} title={"Тензометры"}/>
      {/*<LineColumnPlot seriesRF251={formattedSeriesRF251}/>*/}
    </Stack>
  );
}

