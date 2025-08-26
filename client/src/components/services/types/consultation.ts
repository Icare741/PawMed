export interface Consultation {
  id: number;
  practitionerId: number;
  patientId: number;
  availabilityId: number;
  patientName: string;
  ownerName: string;
  type: string;
  date: string;
  time: string;
  notes: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  practitioner?: {
    id: number;
    userId: number;
    clinicName: string;
    speciality: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  patient?: {
    id: number;
    name: string;
    species: string;
    ownerName: string;
    ownerEmail: string;
  };
}

export interface ConsultationStats {
  dailyConsultations: number;
  newPatients: number;
  consultationHours: number;
  nextAvailability: string;
}

export interface CreateConsultationDto {
  availabilityId: number;
  type: string;
  date: string;
  time: string;
  notes?: string;
}

export interface ConsultationState {
  consultations: Consultation[];
  stats: ConsultationStats;
  isLoading: boolean;
  error: string | null;
}
