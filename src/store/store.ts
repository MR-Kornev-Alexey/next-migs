// store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

// Создаем хранилище с корневым редюсером
const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
