'use client';
import axios from 'axios';
import {FormAdditionalData} from "@/types/formAdditionalData";


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

  async initSignAdditionalData(formAdditionalData: FormAdditionalData) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        addData: formAdditionalData
      };
      const receivedData = await axios.post(
        'http://localhost:5000/customers/init_additional_data_customer',
        JSON.stringify(sendData),
        { headers: await getHeaders() }
      );
      return receivedData.data
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }
}

export const organizationClient = new OrganizationClient();

