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

export class CustomersClient {
  async getCustomers() {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email
      };
      return await axios.post(
        'http://localhost:5000/customers/all_customers',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async initSignAdditionalData(formAdditionalData: FormAdditionalData) {
    let getEmail = await getHeaders()
    try {
      const sendData = {
        email: getEmail.email,
        addData: formAdditionalData
      };
      return await axios.post(
        'http://localhost:5000/customers/init_additional_data_customer',
        JSON.stringify(sendData),
        {headers: await getHeaders()}
      );
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }

  async findRoleCustomer() {
    try {
      return await axios.get(
        'http://localhost:5000/customers/find_role_customer',
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }



  async createNewCustomer(value) {
    let getEmail = await getHeaders()
    try {
      return await axios.post('http://localhost:5000/customers/create_new_customer',
        JSON.stringify(value),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }
  async getDataAboutOneCustomer(email) {
    try {
      return await axios.post('http://localhost:5000/customers/get_data_about_one_customer',
        JSON.stringify({email: email} ),
        {headers: await getHeaders()}
      )
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
  }
}


export const customersClient = new CustomersClient();

