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
async function getHeadersWithFile() {
  const dataUser = localStorage.getItem('custom-auth-token');
  let token = '', email = '';
  if (dataUser !== null) {
    token = JSON.parse(dataUser).password;
    email = JSON.parse(dataUser).email;
  }
  return {
    'Content-Type': 'multipart/form-data',
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
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
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
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }

  async getAllDataAboutOneSensor (id) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: id
      };
      return await axios.post(
        'http://localhost:5000/sensors/get_all_data_about_one_sensor',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }

  async initNewAllTypeOfSensors (jsonData) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        jsonData: jsonData
      };
      const receivedData = await axios.post(
        'http://localhost:5000/sensors/init_all_new_type_sensor',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
      return receivedData.data
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async addLogDataForSensor (formData: any) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        jsonData: formData
      };
      // Отправляем formData на сервер
      return await axios.post(
        'http://localhost:5000/sensors/set_log_data_for_sensor',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }

  async changeIPForSensor (ip: string, id: string) {
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
      return { error: error.message };
    }
  }

  async saveFileAboutSensor (formData: any) {
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
      return { error: error.message };
    }
  }
  async addAdditionalDataForSensor (additionalDataForSensor: AdditionalDataForSensor) {
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
      return { error: error.message };
    }
  }

  async importNewSensorsToObject (object_id, csv) {
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
      return { error: error.message };
    }
  }
  async setNewSensorToObject (sensorData: SensorData) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        sensorsData: sensorData
      };
      return await axios.post(
        'http://localhost:5000/sensors/set_new_sensor_to_object',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }



  async deleteOneSensorFromApi(value){
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        id: value
      };
      return await axios.post(
        'http://localhost:5000/sensors/delete_one_sensor_from_api',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async createNewTypeSensor(value){
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
      return { error: error.message };
    }
  }
}

export const sensorsClient = new SensorsClient();

