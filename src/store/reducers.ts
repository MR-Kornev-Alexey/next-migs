'use client';
import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counterReducer';
import userReducer from "./userReducer";
import addUserReducer from "./addUserReducer"
import mainUserReducer from "./mainUserReducer"
import notificationReducer from "./notificationReducer"

// Объединяем редюсеры
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  addUser: addUserReducer,
  mainUser: mainUserReducer,
  notifications: notificationReducer
});

export default rootReducer;
