
'use client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '@/types'; // Предположим, что у вас есть тип UserData для данных пользователя

export const getUserData = createAsyncThunk<UserData, void>(
  'user/getUserData',
  async () => {
    try {
      const response = await fetch('/api/user');
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  }
);
