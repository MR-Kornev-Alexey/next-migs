import { calculateDistance } from "@/lib/calculate/calculate-distance";
import parseSensorInD3 from "@/lib/parse-sensor/parse-sensor-in-d3";
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";
import formatDateTime from "@/lib/common/formatDateTime";

type DataEntry = {
  id: number;
  sensor_id: string;
  request_code: string;
  answer_code: string;
  created_at: string;
};

type Input = {
  [key: string]: DataEntry[];
};

type Output = {
  series: {
    name: string;
    data: {
      x: string;
      y: string;
    }[];
  }[];
  categories: string[];
};

type RequestSensorInfo = {
  id: number;
  sensor_id: string;
  request_code: string;
  answer_code: string;
  created_at: string;
};

type GroupedData = {
  [key: string]: RequestSensorInfo[];
};



const sortedGroupedData = (sensors: Sensor[], groupedData: GroupedData): GroupedData => {
  const sortedIds = sensors.map(sensor => sensor.id);

  const sortedGroupedData: GroupedData = {};
  for (const id of sortedIds) {
    if (groupedData[id]) {
      sortedGroupedData[id] = groupedData[id];
    }
  }

  return sortedGroupedData;
};

export default function transformData(input: Input, sensors: Sensor[]): Output {
  const sortedInput = sortedGroupedData(sensors, input);
  const sensorMap = new Map(sensors.map(sensor => [sensor.id, sensor]));

  const series = Object.keys(sortedInput).map(key => {
    const dataEntries = sortedInput[key];
    const sensorId = dataEntries[0].sensor_id;
    const sensor = sensorMap.get(sensorId);

    if (!sensor) {
      throw new Error(`Sensor with id ${sensorId} not found`);
    }

    const parseData = (entry: DataEntry) => {
      let x = '';
      let y = '';
      let zero = sensor.requestSensorInfo[0].base_zero
      switch (sensor.model) {
        case 'ИН-Д3': {
          const parsedData = parseSensorInD3(entry.answer_code);
          const lastValueX = parsedData.angleX;
          const lastValueY = parsedData.angleY;
          x = formatDateTime(entry.created_at);
          y = parseFloat((calculateDistance(lastValueX, lastValueY) - zero).toFixed(2))
          break;
        }
        case 'РФ-251': {
          const parsedData = parseSensorRf251(entry.answer_code);
          x = formatDateTime(entry.created_at);
          y = parseFloat((parsedData.distance - zero).toFixed(2))
          break;
        }
        default:
          x = formatDateTime(entry.created_at);
          y = entry.answer_code;
      }
      return { x, y };
    };

    const data = dataEntries.map(parseData);

    return {
      name: `${sensor.sensor_type} ${sensor.designation} сетевой номер ${sensor.network_number}`,
      sensor_id: sensorId,
      model: sensor.model,
      lastValueX: data.length ? data[data.length - 1].x : '',
      lastValueY: data.length ? data[data.length - 1].y : '',
      histogramValue: data.length ? data[data.length - 1].y : '',
      requestSensorInfo: sensor.requestSensorInfo,
      data,
    };
  });

  const categories = sortedInput[Object.keys(sortedInput)[0]].map(entry => formatDateTime(entry.created_at));

  return { series, categories };
}
