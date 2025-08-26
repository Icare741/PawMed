import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axiosInstance from '@/utils/axiosInstance'

// Types
export interface PrescriptionItem {
  id: number
  prescriptionId: number
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string | null
  quantity: number
  unit: string
  createdAt: string
  updatedAt: string
}

export interface Prescription {
  id: number
  patientId: number
  practitionerId: number
  consultationId: number | null
  prescriptionDate: string
  status: 'active' | 'completed' | 'expired'
  notes: string | null
  createdAt: string
  updatedAt: string
  patient?: {
    id: number
    name: string
    species: string
    breed: string | null
  }
  practitioner?: {
    id: number
    name: string
    speciality: string
  }
  items: PrescriptionItem[]
}

export interface CreatePrescriptionData {
  patientId: number
  consultationId?: number
  prescriptionDate: string
  status: 'active' | 'completed' | 'expired'
  notes?: string
  items: {
    medicationName: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
    quantity?: number
    unit?: string
  }[]
}

export interface UpdatePrescriptionData {
  status?: 'active' | 'completed' | 'expired'
  notes?: string
}

// State
interface PrescriptionsState {
  prescriptions: Prescription[]
  currentPrescription: Prescription | null
  isLoading: boolean
  error: string | null
}

const initialState: PrescriptionsState = {
  prescriptions: [],
  currentPrescription: null,
  isLoading: false,
  error: null
}

// Thunks
export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/prescriptions')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des ordonnances')
    }
  }
)

export const fetchPrescription = createAsyncThunk(
  'prescriptions/fetchPrescription',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/prescriptions/${id}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de l\'ordonnance')
    }
  }
)

export const createPrescription = createAsyncThunk(
  'prescriptions/createPrescription',
  async (data: CreatePrescriptionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/prescriptions', data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de l\'ordonnance')
    }
  }
)

export const updatePrescription = createAsyncThunk(
  'prescriptions/updatePrescription',
  async ({ id, data }: { id: number; data: UpdatePrescriptionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/prescriptions/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'ordonnance')
    }
  }
)

export const deletePrescription = createAsyncThunk(
  'prescriptions/deletePrescription',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/prescriptions/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'ordonnance')
    }
  }
)

// Slice
const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPrescription: (state, action: PayloadAction<Prescription | null>) => {
      state.currentPrescription = action.payload
    },
    clearCurrentPrescription: (state) => {
      state.currentPrescription = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch prescriptions
      .addCase(fetchPrescriptions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions = action.payload
        state.error = null
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch single prescription
      .addCase(fetchPrescription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPrescription.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPrescription = action.payload
        state.error = null
      })
      .addCase(fetchPrescription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create prescription
      .addCase(createPrescription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions.unshift(action.payload)
        state.error = null
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update prescription
      .addCase(updatePrescription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions = state.prescriptions.map(prescription =>
          prescription.id === action.payload.id ? action.payload : prescription
        )
        if (state.currentPrescription?.id === action.payload.id) {
          state.currentPrescription = action.payload
        }
        state.error = null
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete prescription
      .addCase(deletePrescription.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.isLoading = false
        state.prescriptions = state.prescriptions.filter(prescription => prescription.id !== action.payload)
        if (state.currentPrescription?.id === action.payload) {
          state.currentPrescription = null
        }
        state.error = null
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, setCurrentPrescription, clearCurrentPrescription } = prescriptionsSlice.actions
export default prescriptionsSlice.reducer
