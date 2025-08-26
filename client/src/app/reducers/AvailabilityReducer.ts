import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Availability, CreateAvailabilityDto } from '@/components/services/types/availability';
import axiosInstance from '@/utils/axiosInstance';

// Thunks
export const fetchAvailabilities = createAsyncThunk(
  'availabilities/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/availabilities');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des disponibilités');
    }
  }
);

export const createAvailability = createAsyncThunk(
  'availabilities/create',
  async (data: CreateAvailabilityDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/availabilities', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la disponibilité');
    }
  }
);

export const deleteAvailability = createAsyncThunk(
  'availabilities/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/availabilities/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de la disponibilité');
    }
  }
);

interface AvailabilityState {
  items: Availability[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AvailabilityState = {
  items: [],
  isLoading: false,
  error: null,
};

const availabilitySlice = createSlice({
  name: 'availabilities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch availabilities
      .addCase(fetchAvailabilities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailabilities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailabilities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create availability
      .addCase(createAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete availability
      .addCase(deleteAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default availabilitySlice.reducer;
