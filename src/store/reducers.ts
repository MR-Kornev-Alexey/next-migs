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
import setZeroReducer from "@/store/setZeroReducer";

// Объединяем редюсеры
const rootReducer = combineReducers({
  setZero: setZeroReducer,
  counter: counterReducer,
  user: userReducer,
  addUser: addUserReducer,
  mainUser: mainUserReducer,
  notifications: notificationReducer,
  allSensors: sensorsReducer,
  allObjects: objectReducer,
  additionalDataOfSensor: additionalDataOfSensorReducer
});

export default rootReducer;
