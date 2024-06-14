'use client';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: { value: any[] } = {
  value: []
};

const objectSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    addObjects(state, action: PayloadAction<any>) {
      state.value.push(action.payload);
    },
  },
});

export const {  addObjects } = objectSlice.actions;
export default objectSlice.reducer;
