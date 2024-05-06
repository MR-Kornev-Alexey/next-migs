'use client';
import axios from 'axios';
import {FormDataOrganization} from "@/types/formDataOrganization";


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

export class OrganizationClient {
  async checkOrganization(value) {
    try {
      return await axios.post(
        'http://localhost:5000/organization/check_organization',
        JSON.stringify(value),
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async getAllOrganization() {
    try {
      return await axios.get(
        'http://localhost:5000/organization/get_all_organizations',
        { headers: await getHeaders() }
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async initMainOrganization(formDataOrganization: FormDataOrganization) {
    console.log(formDataOrganization)
    try{
      return await axios.post(
        'http://localhost:5000/organization/initial_main_organization',
         JSON.stringify(formDataOrganization), // Преобразование объекта в JSON-строку
        { headers: await getHeaders() }// Передача заголовков в конфигурацию запроса
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
  async createNewOrganization(formDataOrganization: FormDataOrganization) {
    console.log(formDataOrganization)
    let getEmail = await getHeaders()
    try{
      const sentData = {
        email:getEmail.email,
        organizationsData: formDataOrganization
      }
      return await axios.post(
        'http://localhost:5000/organization/create_new_organization',
         JSON.stringify(sentData), // Преобразование объекта в JSON-строку
        { headers: await getHeaders() }// Передача заголовков в конфигурацию запроса
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
}

export const organizationClient = new OrganizationClient();

