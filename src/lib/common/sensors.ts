interface Sensor {
  type: string;
  model: string | string[];
}

const sensors: { [key: string]: Sensor } = {
  strainGauge: { type: "Тензометр", model: ["РФ-251", "LS5", "SVWG-D01"] },
  inclinometer: { type: "Инклинометр", model: ["ИН-Д3"] },
  rangefinder: { type: "Дальномер", model: ["DLS-B 15", "FLS-C 10"] },
  GNSSreceiver: { type: "Приемник ГНСС", model: "Galaxy G1 Plus" },
  temperatureSensor: { type: "Датчик температуры", model: "ДТС125М-50М" },
  weatherStation: { type: "Метеостанция", model: "АУРА" },
};

export default sensors;
