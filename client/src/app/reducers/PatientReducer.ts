import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PatientState, Patient, CreatePatientDto, UpdatePatientDto } from '@/components/services/types/patient';
import axiosInstance from '@/utils/axiosInstance';

// Thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/patients');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des patients');
    }
  }
);

export const fetchPatient = createAsyncThunk(
  'patients/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/patients/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement du patient');
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/create',
  async (data: CreatePatientDto, { rejectWithValue }) => {
    try {
      console.log('Données envoyées à l\'API:', data);
      const response = await axiosInstance.post('/patients', data);
      console.log('Réponse de l\'API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur complète:', error);
      console.error('Réponse d\'erreur:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Erreur lors de la création du patient'
      );
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, data }: { id: number; data: UpdatePatientDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/patients/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du patient');
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/patients/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du patient');
    }
  }
);

const initialState: PatientState = {
  items: [],
  selectedPatient: null,
  isLoading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch one patient
      .addCase(fetchPatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPatient = action.payload;
        state.error = null;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create patient
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update patient
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        );
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete patient
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
        state.error = null;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedPatient, clearError } = patientSlice.actions;
export default patientSlice.reducer;
