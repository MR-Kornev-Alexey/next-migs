import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Подставьте свой корневой редюсер

export const store = configureStore({
  reducer: rootReducer,
});
