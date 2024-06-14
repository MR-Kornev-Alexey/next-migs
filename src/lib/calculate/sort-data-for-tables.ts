interface SensorData {
  id: number;
  sensor_id: string;
  request_code: string;
  answer_code: string;
  created_at: string;
}

interface SelectedRow {
  id: string;
  object_id: string;
  sensor_type: string;
  sensor_key: string;
  model: string;
  ip_address: string;
  designation: string;
  network_number: number;
  notation: string;
  run: boolean;
  object: {
    id: string;
    organization_id: string;
    objectsType: string;
    objectsMaterial: string;
    geo: string;
    name: string;
    address: string;
    notation: string;
  };
  additional_sensor_info: any[];
  sensor_operation_log: any[];
  files: any[];
}

interface SortedSensorInfo {
  sensor_type: string;
  sensor_key: string;
  model: string;
  data: SensorData[];
}

interface SortedSensors {
  [key: string]: SortedSensorInfo;
}

const sortingSensors = (
  obj_1: Record<string, SensorData[]>,
  selectedRows: SelectedRow[]
): SortedSensors => {
  const result: SortedSensors = {};

  // Create a map for quick lookup of sensor type and model by sensor_id
  const sensorInfoMap = new Map<string, { sensor_type: string; sensor_key: string; model: string }>();
  selectedRows.forEach((row) => {
    sensorInfoMap.set(row.id, {
      sensor_type: row.sensor_type,
      sensor_key: row.sensor_key,
      model: row.model,
      designation: row.designation
    });
  });

  // Populate result object with sensor info and associate data from obj_1
  Object.keys(obj_1).forEach((key) => {
    const sensorInfo = sensorInfoMap.get(key);
    if (sensorInfo) {
      result[key] = {
        ...sensorInfo,
        data: obj_1[key],
      };
    }
  });

  // Convert result object to array for sorting
  const sortedEntries = Object.entries(result).sort(([keyA, valueA], [keyB, valueB]) => {
    if (valueA.sensor_key < valueB.sensor_key) {
      return -1;
    } else if (valueA.sensor_key > valueB.sensor_key) {
      return 1;
    } else {
      // sensor_key is equal, sort by model
      if (valueA.model < valueB.model) {
        return -1;
      } else if (valueA.model > valueB.model) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  // Convert sorted array back to object
  const sortedResult: SortedSensors = {};
  sortedEntries.forEach(([key, value]) => {
    sortedResult[key] = value;
  });

  return sortedResult;
};
export default sortingSensors;
