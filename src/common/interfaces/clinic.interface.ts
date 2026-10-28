export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DoctorReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DaySchedule {
  start: string;
  end: string;
}

export interface DoctorSchedule {
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: DaySchedule | null;
  sunday: DaySchedule | null;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialtyIds: string[];
  title: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationPrice: number;
  bio: string;
  education: string[];
  languages: string[];
  gender: 'male' | 'female';
  photoInitials: string;
  photoHue: number;
  schedule: DoctorSchedule;
  reviews: DoctorReview[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  specialtyId: string;
  durationMinutes: number;
  price: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  durationMinutes: number;
  patientName: string;
  patientPhone: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  about: string;
  address: string;
  phones: string[];
  email: string;
  workingHoursLabel: string;
  years: number;
  patientCount: number;
  doctorCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

