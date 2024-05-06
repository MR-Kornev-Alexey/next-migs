interface MeasurementUnit {
  type: string;
  model: string;
  name_unit: string[];
  value: string[];
}

interface UnitOfMeasurement {
  strainGauge: MeasurementUnit[];
  inclinometer: MeasurementUnit[];
  rangefinder: MeasurementUnit[];
  GNSSreceiver: MeasurementUnit[];
  temperatureSensor: MeasurementUnit[];
  weatherStation: MeasurementUnit[];
}

const UnitOfMeasurement: UnitOfMeasurement = {
  strainGauge: [
    {
      type: 'Тензометр',
      model: 'РФ-251',
      name_unit: ['мм (без коэф.)', 'мкм (без коэф.)', 'кгс/кв.см (с коэф.)'],
      value: ['mm_without_coefficient',
        'mkm_without_coefficient', 'kgf_sq_cm_with_coefficient']
    },
    {
      type: 'Тензометр',
      model: 'LS5',
      name_unit: ['мм', 'мкм', 'кгс/кв.см'],
      value: ['mm',
        'mkm', 'kgf_sq_cm']
    },
    {
      type: 'Тензометр',
      model: 'SVWG-D01',
      name_unit: ['мм', 'мкм', 'кгс/кв.см'],
      value: ['mm',
        'mkm', 'kgf_sq_cm']
    }
  ],
  inclinometer: [
    {
      type: 'Инклинометр',
      model: 'ИН-Д3',
      name_unit: ['угл.сек'],
      value: ['angle_sec']
    }],
  rangefinder: [
    {
      type: 'Дальномер',
      model: 'DLS-B 15',
      name_unit: ['мм'],
      value: ['mm']
    },
    {
      type: 'Дальномер',
      model: 'FLS-C 10',
      name_unit: ['мм'],
      value: ['mm']
    }
  ],
  GNSSreceiver: [
    {
      type: 'Приемник ГНСС',
      model: 'Galaxy G1 Plus',
      name_unit: ['мм', 'см'],
      value: ['mm', 'sm']
    }],
  temperatureSensor: [
    {
      type: 'Датчик температуры',
      model: 'ДТС125М-50М',
      name_unit: ['градус (температура)'],
      value: ['degree_temperature']
    }
  ],
  weatherStation: [
    {type: 'Метеостанция',
      model: 'АУРА',
      name_unit: ['градус(температура), м/с, градус (угол)'],
      value: ['meteo_value']}
  ],
};

export default UnitOfMeasurement;
