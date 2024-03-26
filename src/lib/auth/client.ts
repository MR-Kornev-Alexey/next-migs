'use client';
import axios from 'axios';

import type { User } from '@/types/user';


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
  terms: boolean;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  private responseLogin: any;
  async signUp(signUpParams: SignUpParams): Promise<{ error?: string }> {
    console.log(signUpParams)
    try {
      const headers = { 'Content-Type': 'application/json' }; // Установка заголовка Content-Type

      const response = await axios.post(
        'http://localhost:5000/auth/register',
        JSON.stringify(signUpParams), // Преобразование объекта в JSON-строку
        { headers } // Передача заголовков в конфигурацию запроса
      );

    } catch (error) {
      // Обработка ошибок
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();
    // localStorage.setItem('custom-auth-token', token);
    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    console.log(params)
    // Make API request
    try {
     const token =  localStorage.getItem('custom-auth-token');
      const  headers= {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Добавляем токен в заголовок Authorization
        }
      const  responseLogin = await axios.post(
        'http://localhost:5000/auth/login',
        JSON.stringify(params), // Преобразование объекта в JSON-строку
        { headers } // Передача заголовков в конфигурацию запроса
      );
      console.log(responseLogin)
      localStorage.setItem('custom-auth-token', JSON.stringify(responseLogin.data.user));
    } catch (error) {
      // Обработка ошибок
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
