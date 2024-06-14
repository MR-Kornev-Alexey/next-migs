'use client';
// counterReducer.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Начальное состояние счетчика
const initialState = {
  value: false,
};

const setZeroSlice = createSlice({
  name: 'setZero',
  initialState,
  reducers: {
    setZeroTrue(state, action: PayloadAction<number>) {
      state.value = true;
    },
    setZeroFalse(state, action: PayloadAction<number>) {
      state.value = false;
    },
  },
});


export const { setZeroTrue, setZeroFalse } = setZeroSlice.actions;
export default setZeroSlice.reducer;
