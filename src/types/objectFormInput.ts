export interface ObjectFormInput {
  organization_id: string;
  objectsType: string;
  objectsMaterial: string;
  geo: string;
  name: string;
  address: string;
  notation: string;
  // sensors: SensorFormInput[]; // Предполагается, что у вас есть типизация для SensorFormInput
}
