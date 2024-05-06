'use client';
import axios from 'axios';

import {ObjectFormInput} from "@/types/objectFormInput";
import getHeaders from "@/lib/common/getHeaders";

export class ObjectClient {
  async initSignObject(formDataObject: ObjectFormInput) {
    console.log(formDataObject)
    let getEmail = await getHeaders()
    try{
      const sendData = {
        email: getEmail.email,
        objectsData : formDataObject
      };
      return await axios.post(
        'http://localhost:5000/objects/create_new_object',
        JSON.stringify(sendData), // Преобразование объекта в JSON-строку
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async getAllObjects () {
    let getEmail = await getHeaders()
    try{
      const sendData = {
        email: getEmail.email
      };
      return await axios.post(
        'http://localhost:5000/objects/get_all_objects',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
    }catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
}

export const objectClient: ObjectClient = new ObjectClient();

