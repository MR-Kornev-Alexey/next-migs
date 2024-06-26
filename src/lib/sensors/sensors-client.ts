'use client';
import axios from 'axios';

import {SensorData} from "@/types/sensorData"
import AdditionalDataForSensor from "@/types/additionalDataForSensor"

async function getHeaders() {
  const dataUser = localStorage.getItem('custom-auth-token');
  let token = '', email = '';
  if (dataUser !== null) {
    token = JSON.parse(dataUser).password;
    email = JSON.parse(dataUser).email;
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    email: email
  };
}


export class SensorsClient {
  async getAllSensors() {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email
      };
      return await axios.post(
        'http://localhost:5000/sensors/get_all_sensors',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeTimeRequest(sendData) {
    let getEmail: string = (await getHeaders()).email
    try {
      sendData.email = getEmail
      return await axios.post(
        'http://localhost:5000/sensors/change_time_request_sensors',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async getAllTypeOfSensors() {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email
      };
      return await axios.post(
        'http://localhost:5000/sensors/get_all_type_of_sensors',
        sendData,
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async getAllDataAboutOneSensor(id) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: id
      };
      return await axios.post(
        'http://localhost:5000/sensors/get_all_data_about_one_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async initNewAllTypeOfSensors(jsonData) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        jsonData: jsonData
      };
      const receivedData = await axios.post(
        'http://localhost:5000/sensors/init_all_new_type_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
      return receivedData.data
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async addLogDataForSensor(formData: any) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        logsData: formData
      };
      // Отправляем formData на сервер
      return await axios.post(
        'http://localhost:5000/sensors/set_log_data_for_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeIPForSensor(ip: string, id: string) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        ip: ip,
        id: id
      };
      return await axios.post(
        'http://localhost:5000/sensors/change_ip_for_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeNetAddressSensor(netAddress: string, id: string) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        network_number: Number(netAddress),
        id: id
      };
      return await axios.post(
        'http://localhost:5000/sensors/change_net_address_for_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeWarningSensor(sensor_id) {
    let getEmail = await getHeaders()
    const sendData = {
      email: getEmail.email,
      sensor_id: sensor_id
    };
    try {
      return await axios.post('http://localhost:5000/sensors/change_warning_one_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async saveFileAboutSensor(formData: any) {
    let getEmail = await getHeaders()
    formData.append("email", getEmail.email);
    try {
      return await axios.post('http://localhost:5000/sensors/save_file_about_sensor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async addAdditionalDataForSensor(additionalDataForSensor: AdditionalDataForSensor) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        additionalDataForSensor: additionalDataForSensor
      };
      return await axios.post(
        'http://localhost:5000/sensors/set_additional_data_for_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async addRequestDataForSensor(requestDataForSensor: any) {
    let getEmail = await getHeaders()
    requestDataForSensor.periodicity = Number(requestDataForSensor.periodicity)
    try {
      const sendData = {
        email: getEmail.email,
        requestDataForSensor: requestDataForSensor
      };
      return await axios.post(
        'http://localhost:5000/sensors/set_request_data_for_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async importNewSensorsToObject(object_id, csv) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        object_id: object_id.object_id,
        sensorsData: csv
      };
      return await axios.post(
        'http://localhost:5000/sensors/import_new_sensors_to_object',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async setNewSensorToObject(sensorData: SensorData, requestData: any) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        sensorsData: sensorData,
        requestData: requestData
      };
      return await axios.post(
        'http://localhost:5000/sensors/set_new_sensor_to_object',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeValuesDataSensor(value, flag, id) {
    let getEmail = await getHeaders();
    console.log('value --', value);
    try {
      const sendData = {
        email: getEmail.email,
        value: value,
        flag: flag,
        id: id
      };
      return await axios.post(
        'http://localhost:5000/sensors/change_value_one_sensor_from_api',
        sendData, // Не нужно преобразовывать в строку JSON
        {headers: await getHeaders()}
      ); // Возвращаем данные из ответа сервера
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeDesignationOneSensorFromApi(id, value) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: id,
        designation: value
      };
      return await axios.post(
        'http://localhost:5000/sensors/change_designation_one_sensor_from_api',
        sendData,
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }


  async setNullForOneSensor(id, flag) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: id,
        flag: flag
      };
      return await axios.post(
        'http://localhost:5000/sensors/set_null_for_one_sensor',
        sendData,
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeStatusOneSensorFromApi(value) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: value
      };
      return await axios.post(
        'http://localhost:5000/sensors/change_status_one_sensor_from_api',
        sendData,
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async changeDataForEmissionProcessing(id) {
    let getEmail = await getHeaders()
    try {
      id.email =  getEmail.email
      return await axios.post(
        'http://localhost:5000/sensors/change_data_for_emission_processing',
        id,
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }
  async changeNullOrPeriodForOneSensor(id, flag, value) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: id,
        flag: flag,
        periodicity: value
      };
      return await axios.post(
        'http://localhost:5000/sensors/change_parameters_for_one_object',
        sendData,
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async deleteOneSensorFromApi(id) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: id
      };
      return await axios.post(
        'http://localhost:5000/sensors/delete_one_sensor_from_api',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async createNewTypeSensor(value) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        sensorsData: value
      };
      return await axios.post(
        'http://localhost:5000/sensors/create_new_type_sensor',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }
}

export const sensorsClient = new SensorsClient();

