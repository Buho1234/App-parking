import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import parkingSlice from './slices/parkingSlice';
import bookingSlice from './slices/bookingSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    parking: parkingSlice,
    booking: bookingSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;