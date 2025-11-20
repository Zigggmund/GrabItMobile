import { configureStore } from '@reduxjs/toolkit';

import cityReducer from './city/citySlice';

export const store = configureStore({
  reducer: {
    city: cityReducer,
  },
});

// легкий доступ к состояниям с помощью селекторов
export type RootState = ReturnType<typeof store.getState>;
// асинхронные действия с помощью dispatch-хука
export type AppDispatch = typeof store.dispatch;
