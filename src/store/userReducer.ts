'use client';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { UserData } from '@/types/userData';

// Используйте интерфейс UserData для определения типа данных в состоянии
interface UserState {
  data: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

// Создание среза (slice) счетчика с помощью createSlice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.value = action.payload;
    },
  },
});

// Экспорт редюсера и действий (actions)
export const {  setUser } = userSlice.actions;
export default userSlice.reducer;
