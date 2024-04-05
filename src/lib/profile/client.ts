'use client';
import axios from 'axios';

import type { User } from '@/types/user';
import { ProfileParams } from '@/types/profileParams';

class ProfileClient {
  private responseProfile: any;
  async signProfile(profileParams: ProfileParams): Promise<{ error?: string }> {
    console.log(profileParams)
    try {
      let token
      const dataUser = localStorage.getItem('custom-auth-token');// Получение  роли  пользователя из контекста или хранилища
      if (dataUser != null) {
        token = JSON.parse(dataUser).password
      }
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const responseProfile = await axios.post(
        'http://localhost:5000/auth/profile',
        JSON.stringify(profileParams), // Преобразование объекта в JSON-строку
        { headers } // Передача заголовков в конфигурацию запроса
      );
      console.log('responseProfile - ', responseProfile)

    } catch (error) {
      // Обработка ошибок
      console.error('Произошла ошибка:', error.message);
      return { error: error.message };
    }
    return {};
  }
}

export const profileClient = new ProfileClient();
