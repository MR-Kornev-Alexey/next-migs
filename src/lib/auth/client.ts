'use client';
import axios from 'axios';

import type {User} from '@/types/user';

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  organizationInn: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(signUpParams: SignUpParams): Promise<{ error?: string }> {
    try {
      const headers = {'Content-Type': 'application/json'}; // Установка заголовка Content-Type
      const response = await axios.post(
        'http://localhost:5000/auth/register',
        JSON.stringify(signUpParams), // Преобразование объекта в JSON-строку
        {headers} // Передача заголовков в конфигурацию запроса
      );
      console.log(response)
      if(response) {
        localStorage.setItem('custom-auth-token', JSON.stringify(response.data.user));
        return response
      } else {
        return {}
      }

    } catch (error) {
      // Обработка ошибок
      console.error('Произошла ошибка:', error.message);
      return {error: error.message};
    }
    // return {};
  }


  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; responseLogin?: any }> {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Добавляем токен в заголовок Authorization
      }
      const responseLogin = await axios.post(
        'http://localhost:5000/auth/login',
        JSON.stringify(params), // Преобразование объекта в JSON-строку
        { headers } // Передача заголовков в конфигурацию запроса
      );
      if (responseLogin.data) {
        localStorage.setItem('custom-auth-token', JSON.stringify(responseLogin.data.user));
        return { responseLogin: responseLogin.data };
      } else {
        return {};
      }
    } catch (error) {
      // Обработка ошибок
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
  }


  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return {error: 'Password reset not implemented'};
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return {error: 'Update reset not implemented'};
  }

  async getUser(email): Promise<{ data?: User | null; error?: string }> {
    let token
    const dataUser = localStorage.getItem('custom-auth-token');// Получение  роли  пользователя из контекста или хранилища
    if (dataUser != null) {
      token = JSON.parse(dataUser).password
    }
    if (!token) {
      return {data: null};
    }
    return {data: user};
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
