'use client';
import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counterReducer';
import userReducer from "./userReducer";
import addUserReducer from "./addUserReducer"
import mainUserReducer from "./mainUserReducer"
import notificationReducer from "./notificationReducer"
import additionalDataOfSensorReducer from "@/store/additionalDataOfSensorReducer";
import sensorsReducer from "@/store/sensorsReducer";
import objectReducer from "@/store/objectReducer";
import typeOfSensorsReducer from "@/store/typeOfSensorsReducer";
import selectedSensorReducer from "@/store/selectedSensorReducer";

// Объединяем редюсеры

const rootReducer = combineReducers({
  user: userReducer,
  addUser: addUserReducer,
  mainUser: mainUserReducer,
  notifications: notificationReducer,
  selectedSensor: selectedSensorReducer,
  allSensors: sensorsReducer,
  allTypesOfSensors: typeOfSensorsReducer,
  allObjects: objectReducer,
  additionalDataOfSensor: additionalDataOfSensorReducer
});

export default rootReducer;
