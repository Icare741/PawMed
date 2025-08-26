export interface Patient {
  id: number;
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  owner_name: string;
  owner_email: string;
  owner_phone?: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
  consultations?: any[];
}

export interface CreatePatientDto {
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  owner_name: string;
  owner_email: string;
  owner_phone?: string;
  medical_history?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export interface PatientState {
  items: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
}
