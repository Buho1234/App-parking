import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingRequest, Booking } from '../../types';

interface BookingState {
  myRequests: BookingRequest[];
  receivedRequests: BookingRequest[];
  myBookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  myRequests: [],
  receivedRequests: [],
  myBookings: [],
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    fetchBookingDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMyRequestsSuccess: (state, action: PayloadAction<BookingRequest[]>) => {
      state.myRequests = action.payload;
    },
    fetchReceivedRequestsSuccess: (state, action: PayloadAction<BookingRequest[]>) => {
      state.receivedRequests = action.payload;
    },
    fetchMyBookingsSuccess: (state, action: PayloadAction<Booking[]>) => {
      state.myBookings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchBookingDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createBookingRequestStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createBookingRequestSuccess: (state, action: PayloadAction<BookingRequest>) => {
      state.isLoading = false;
      state.myRequests.push(action.payload);
      state.error = null;
    },
    createBookingRequestFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateBookingRequestStatus: (state, action: PayloadAction<{ requestId: string; status: BookingRequest['status'] }>) => {
      // Update in received requests
      const receivedIndex = state.receivedRequests.findIndex(req => req.id === action.payload.requestId);
      if (receivedIndex !== -1) {
        state.receivedRequests[receivedIndex].status = action.payload.status;
      }
      
      // Update in my requests
      const myIndex = state.myRequests.findIndex(req => req.id === action.payload.requestId);
      if (myIndex !== -1) {
        state.myRequests[myIndex].status = action.payload.status;
      }
    },
    addNewBooking: (state, action: PayloadAction<Booking>) => {
      state.myBookings.push(action.payload);
    },
    updateBookingStatus: (state, action: PayloadAction<{ bookingId: string; status: Booking['status'] }>) => {
      const index = state.myBookings.findIndex(booking => booking.id === action.payload.bookingId);
      if (index !== -1) {
        state.myBookings[index].status = action.payload.status;
      }
    },
    addBookingRating: (state, action: PayloadAction<{ 
      bookingId: string; 
      rating: number; 
      review: string; 
      isProviderRating: boolean;
    }>) => {
      const index = state.myBookings.findIndex(booking => booking.id === action.payload.bookingId);
      if (index !== -1) {
        if (action.payload.isProviderRating) {
          state.myBookings[index].providerRating = action.payload.rating;
          state.myBookings[index].providerReview = action.payload.review;
        } else {
          state.myBookings[index].seekerRating = action.payload.rating;
          state.myBookings[index].seekerReview = action.payload.review;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBookingDataStart,
  fetchMyRequestsSuccess,
  fetchReceivedRequestsSuccess,
  fetchMyBookingsSuccess,
  fetchBookingDataFailure,
  createBookingRequestStart,
  createBookingRequestSuccess,
  createBookingRequestFailure,
  updateBookingRequestStatus,
  addNewBooking,
  updateBookingStatus,
  addBookingRating,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;