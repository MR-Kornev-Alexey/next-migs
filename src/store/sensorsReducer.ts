'use client';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import sortSensorsByObjectId from "@/lib/common/sort-sensors-by-objects";
import updateSensorsAfterAPI from "@/lib/common/update-sensors-after-api";

const initialState: { value: any[] } = {
  value: []
};

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    addSensors(state, action: PayloadAction<any>) {
      state.value = sortSensorsByObjectId(action.payload)
    },
    updateSensors(state, action: PayloadAction<any>) {
      state.value = action.payload
    },
  },
});

export const {  addSensors, updateSensors } = sensorsSlice.actions;
export default sensorsSlice.reducer;
