import { configureStore } from '@reduxjs/toolkit';
import livekitReducer from './slices/livekitSlice'; 

export const store = configureStore({
  reducer: {
    livekit: livekitReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;