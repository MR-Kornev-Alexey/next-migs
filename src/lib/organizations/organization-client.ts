'use client';
import axios from 'axios';
import {FormAdditionalData} from "@/types/formAdditionalData";
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
    let getEmail = await getHeaders()
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
}

export const organizationClient = new OrganizationClient();

