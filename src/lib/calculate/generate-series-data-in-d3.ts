// types.ts
import {calculateDistance} from "@/lib/calculate/calculate-distance";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";

export interface Sensor {
  id: string;
  designation: string;
  network_number: number;
}

export interface ReceivedData {
  sensor_id: string;
  answer_code: string;
}
export const generateSeriesData = (
  receivedData: ReceivedData[],
  sensors: Sensor[]
) => {
  const seriesDistance: { [key: string]: number[] } = {};

  sensors.forEach(sensor => {
    seriesDistance[sensor.id] = [];
  });

  receivedData.forEach((receivedData) => {
    const distance =     calculateDistance(parseSensorInD3(receivedData.answer_code).angleX, parseSensorInD3(receivedData.answer_code).angleY)
    if (seriesDistance[receivedData.sensor_id]) {
      seriesDistance[receivedData.sensor_id].push(distance);
    }
  });

  return sensors.map(sensor => ({
    name: `${sensor.designation} ${sensor.network_number}`,
    data: seriesDistance[sensor.id] || [],
  }));
};
