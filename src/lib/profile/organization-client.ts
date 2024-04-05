'use client';
import axios from 'axios';

import type { User } from '@/types/user';
import { FormDataOrganization } from '@/types/formDataOrganization';

export class OrganizationClient {
  static async signProfile(formData: FormData) {
    console.log(formData)
    try {
      let token, email;
      const dataUser = localStorage.getItem('custom-auth-token');// Получение  роли  пользователя из контекста или хранилища
      if (dataUser != null) {
        token = JSON.parse(dataUser).password
        email = JSON.parse(dataUser).email
      }
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        email: email
      };

      // Создаем объект данных для отправки
      const sendData = {
        formData: formData,
        email: email,
      };

      const responseOrganization = await axios.post(
        'http://localhost:5000/create_organization',
        JSON.stringify(sendData), // Преобразование объекта в JSON-строку
        { headers } // Передача заголовков в конфигурацию запроса
      );
      console.log('responseOrganization - ', responseOrganization.data)
      return responseOrganization

    } catch (error) {
      // Обработка ошибок
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }

  async initSignOrganization(formDataOrganization: FormDataOrganization) {
    console.log(formDataOrganization)
    try{
      const headers = {
        'Content-Type': 'application/json'
      };
      const responseOrganization = await axios.post(
        'http://localhost:5000/organization/init_organization',
        JSON.stringify(formDataOrganization), // Преобразование объекта в JSON-строку
        { headers } // Передача заголовков в конфигурацию запроса
      );
      console.log(responseOrganization)
      return responseOrganization;
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }

  async getOrganizations(){
    const responseOrganization = await axios.get(
      'http://localhost:5000/organization/get_all_organization'// Передача заголовков в конфигурацию запроса
    );
    console.log(responseOrganization)
    return responseOrganization
  }
}

export const organizationClient = new OrganizationClient();
