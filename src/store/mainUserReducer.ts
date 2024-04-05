import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { mainUser } from '@/types/mainUser';


interface UserState {
  data: mainUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const mainUserSlice = createSlice({
  name: 'mainUser',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.value = action.payload;
    },
  },
});

export const {  setUser } = mainUserSlice.actions;
export default mainUserSlice.reducer;
