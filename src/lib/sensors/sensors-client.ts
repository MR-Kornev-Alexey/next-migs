'use client';
import axios from 'axios';
import {FormAdditionalData} from "@/types/formAdditionalData";

import {SensorData} from "@/types/sensorData"
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
  async createNewSensor (sensorData: SensorData) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        sensorsData: sensorData
      };
      const receivedData = await axios.post(
        'http://localhost:5000/sensors/create_new_sensor',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
      return receivedData.data
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

