'use client';
import axios from 'axios';
import getHeaders from "@/lib/common/get-header";
import {SensorsClient} from "@/lib/sensors/sensors-client";


export class SensorsDataClient {


  async getSensorsDataFromApi(sendData) {
    let getEmail:string = (await getHeaders()).email
    try {
      sendData.email =  getEmail
      return await axios.post(
        'http://localhost:5000/sensors_data/get_sensors_data',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async getSensorsLastDataFromApi() {
    let getEmail:string = (await getHeaders()).email
    try {
      return await axios.post(
        'http://localhost:5000/sensors_data/get_sensors_last_data',
        JSON.stringify({email: getEmail}),
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
}

export const sensorsDataClient = new SensorsDataClient();
