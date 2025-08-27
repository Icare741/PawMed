import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ConsultationState, Consultation, ConsultationStats } from '@/components/services/types/consultation';
import axiosInstance from '@/utils/axiosInstance';

// Thunks
export const fetchConsultations = createAsyncThunk(
  'consultations/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/consultations');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des consultations');
    }
  }
);

export const fetchConsultationStats = createAsyncThunk(
  'consultations/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/consultations/stats');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des statistiques');
    }
  }
);

export const createConsultation = createAsyncThunk(
  'consultations/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/consultations', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la consultation');
    }
  }
);

export const updateConsultation = createAsyncThunk(
  'consultations/update',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/consultations/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de la consultation');
    }
  }
);

export const deleteConsultation = createAsyncThunk(
  'consultations/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/consultations/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de la consultation');
    }
  }
);

const initialState: ConsultationState = {
  consultations: [],
  stats: {
    dailyConsultations: 0,
    newPatients: 0,
    consultationHours: 0,
    nextAvailability: '',
  },
  isLoading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch consultations
      .addCase(fetchConsultations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consultations = action.payload;
        state.error = null;
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchConsultationStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConsultationStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchConsultationStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create consultation
      .addCase(createConsultation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createConsultation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consultations.unshift(action.payload);
        state.error = null;
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update consultation
      .addCase(updateConsultation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateConsultation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consultations = state.consultations.map(consultation =>
          consultation.id === action.payload.id ? action.payload : consultation
        );
        state.error = null;
      })
      .addCase(updateConsultation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default consultationSlice.reducer;
