interface ObjectInfo {
  id: string;
  organization_id: string;
  objectsType: string;
  objectsMaterial: string;
  geo: string;
  name: string;
  address: string;
  notation: string;
}

type Sensor = {
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
};
