export interface Availability {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  practitionerId: number;
  practitioner: {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityDto {
  startTime: string;
  endTime: string;
}
