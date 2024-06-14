import decimalToHex from "@/lib/calculate/decimal-to-hex";
import inclinoMeterFormatSensorString from "@/lib/calculate/inclinometer-format-sensor-string";

export default async function calculateRequestCode(netNumber, model) {
  const hexNumber = decimalToHex(Number(netNumber))
  switch (model) {
    case 'ИН-Д3':
      return inclinoMeterFormatSensorString(hexNumber)
    case 'РФ-251':
      return hexNumber + ' ' + 86
    default:
      return 'error'
  }
}

// const sensors: { [key: string]:  } = {
//   strainGauge: { type: "Тензометр", model: ["РФ-251", "LS5", "SVWG-D01"] },
//   inclinoMeter: { type: "Инклинометр", model: ["ИН-Д3"] },
//   rangefinder: { type: "Дальномер", model: ["DLS-B 15", "FLS-C 10"] },
//   GNSSReceiver: { type: "Приемник ГНСС", model: "Galaxy G1 Plus" },
//   temperatureSensor: { type: "Датчик температуры", model: "ДТС125М-50М" },
//   weatherStation: { type: "Метеостанция", model: "АУРА" },
// };
