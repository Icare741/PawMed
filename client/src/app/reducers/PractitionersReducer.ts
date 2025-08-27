import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

// Types
export interface Practitioner {
  id: number;
  name: string;
  speciality: string;
  city?: string;
  avatar?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PractitionersState {
  practitioners: Practitioner[];
  practitioner: Practitioner | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PractitionersState = {
  practitioners: [],
  practitioner: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPractitioners = createAsyncThunk(
  'practitioners/fetchPractitioners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/practitioners');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue lors de la récupération des praticiens');
    }
  }
);

export const fetchPractitioner = createAsyncThunk(
  'practitioners/fetchPractitioner',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/practitioners/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue lors de la récupération du praticien');
    }
  }
);

// Slice
const practitionersSlice = createSlice({
  name: 'practitioners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPractitioner: (state) => {
      state.practitioner = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPractitioners
    builder
      .addCase(fetchPractitioners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPractitioners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.practitioners = action.payload;
      })
      .addCase(fetchPractitioners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchPractitioner
    builder
      .addCase(fetchPractitioner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPractitioner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.practitioner = action.payload;
      })
      .addCase(fetchPractitioner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearPractitioner } = practitionersSlice.actions;
export default practitionersSlice.reducer;
