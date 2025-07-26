import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParkingSpace, SearchFilters } from '../../types';

interface ParkingState {
  nearbySpaces: ParkingSpace[];
  mySpaces: ParkingSpace[];
  searchResults: ParkingSpace[];
  searchFilters: SearchFilters | null;
  isLoading: boolean;
  error: string | null;
  selectedSpace: ParkingSpace | null;
}

const initialState: ParkingState = {
  nearbySpaces: [],
  mySpaces: [],
  searchResults: [],
  searchFilters: null,
  isLoading: false,
  error: null,
  selectedSpace: null,
};

const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    fetchNearbySpacesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchNearbySpacesSuccess: (state, action: PayloadAction<ParkingSpace[]>) => {
      state.isLoading = false;
      state.nearbySpaces = action.payload;
      state.error = null;
    },
    fetchNearbySpacesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchMySpacesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMySpacesSuccess: (state, action: PayloadAction<ParkingSpace[]>) => {
      state.isLoading = false;
      state.mySpaces = action.payload;
      state.error = null;
    },
    fetchMySpacesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    searchSpacesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    searchSpacesSuccess: (state, action: PayloadAction<ParkingSpace[]>) => {
      state.isLoading = false;
      state.searchResults = action.payload;
      state.error = null;
    },
    searchSpacesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.searchFilters = action.payload;
    },
    clearSearchFilters: (state) => {
      state.searchFilters = null;
      state.searchResults = [];
    },
    setSelectedSpace: (state, action: PayloadAction<ParkingSpace | null>) => {
      state.selectedSpace = action.payload;
    },
    addParkingSpaceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addParkingSpaceSuccess: (state, action: PayloadAction<ParkingSpace>) => {
      state.isLoading = false;
      state.mySpaces.push(action.payload);
      state.error = null;
    },
    addParkingSpaceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateParkingSpaceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateParkingSpaceSuccess: (state, action: PayloadAction<ParkingSpace>) => {
      state.isLoading = false;
      const index = state.mySpaces.findIndex(space => space.id === action.payload.id);
      if (index !== -1) {
        state.mySpaces[index] = action.payload;
      }
      state.error = null;
    },
    updateParkingSpaceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteParkingSpace: (state, action: PayloadAction<string>) => {
      state.mySpaces = state.mySpaces.filter(space => space.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchNearbySpacesStart,
  fetchNearbySpacesSuccess,
  fetchNearbySpacesFailure,
  fetchMySpacesStart,
  fetchMySpacesSuccess,
  fetchMySpacesFailure,
  searchSpacesStart,
  searchSpacesSuccess,
  searchSpacesFailure,
  setSearchFilters,
  clearSearchFilters,
  setSelectedSpace,
  addParkingSpaceStart,
  addParkingSpaceSuccess,
  addParkingSpaceFailure,
  updateParkingSpaceStart,
  updateParkingSpaceSuccess,
  updateParkingSpaceFailure,
  deleteParkingSpace,
  clearError,
} = parkingSlice.actions;

export default parkingSlice.reducer;