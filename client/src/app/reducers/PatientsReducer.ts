import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axiosInstance from '@/utils/axiosInstance'

// Types
export interface Patient {
  id: number
  name: string
  species: string
  breed: string | null
  birthDate: string | null
  ownerName: string
  ownerEmail: string
  ownerPhone: string | null
  medicalHistory: string | null
  userId: number | null
  createdAt: string
  updatedAt: string
  consultations?: any[]
}

export interface CreatePatientData {
  name: string
  species: string
  breed?: string
  birthDate?: string
  ownerName: string
  ownerPhone?: string
  medicalHistory?: string
  ownerEmail?: string
}

export interface UpdatePatientData {
  name?: string
  species?: string
  breed?: string
  birthDate?: string
  ownerName?: string
  ownerPhone?: string
  medicalHistory?: string
}

interface PatientsState {
  patients: Patient[]
  currentPatient: Patient | null
  isLoading: boolean
  error: string | null
}

const initialState: PatientsState = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  error: null
}

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/patients')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des patients')
    }
  }
)

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/patients/${id}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement du patient')
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: CreatePatientData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/patients', patientData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du patient')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }: { id: number; patientData: UpdatePatientData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/patients/${id}`, patientData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du patient')
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/patients/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du patient')
    }
  }
)

// Slice
const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPatient: (state, action: PayloadAction<Patient | null>) => {
      state.currentPatient = action.payload
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null
    }
  },
  extraReducers: (builder) => {
    // fetchPatients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = action.payload
        state.error = null
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // fetchPatient
    builder
      .addCase(fetchPatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPatient = action.payload
        state.error = null
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // createPatient
    builder
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients.push(action.payload)
        state.error = null
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // updatePatient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.patients.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload
        }
        state.error = null
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // deletePatient
    builder
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = state.patients.filter(p => p.id !== action.payload)
        if (state.currentPatient?.id === action.payload) {
          state.currentPatient = null
        }
        state.error = null
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, setCurrentPatient, clearCurrentPatient } = patientsSlice.actions
export default patientsSlice.reducer
