'use client';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: { value: any[] } = {
  value: []
};

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    addSensors(state, action: PayloadAction<any>) {
      state.value.push(action.payload);
    },
  },
});

export const {  addSensors } = sensorsSlice.actions;
export default sensorsSlice.reducer;
