'use client'

export type MindAssessment = {
  id: string
  surveyId: 'DASS-21'
  surveyVersion: string
  source: 'survey'
  completedAt: string
  name: string
  date: string
  total: number
  depression: number
  anxiety: number
  stress: number
  level: string
}

export type MindBooking = {
  id: string
  patientName: string
  patientEmail: string
  counselor: string
  counselorTitle?: string
  specialty: string
  date: string
  time: string
  mode: 'online' | 'offline'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'upcoming'
  patientPhone?: string
  symptoms?: string
}

export type ClinicalRecord = {
  id: string
  bookingId: string
  patientName: string
  counselor: string
  completedAt: string
  summary: string
}

export type CarePlan = {
  id: string
  patientName: string
  counselor: string
  kind: 'exercise' | 'medicine'
  title: string
  notes: string
  releasedAt: string
}

export type FamilyMember = { id: string; name: string; dob: string; cccd: string; phone: string }

export type Doctor = {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  status: 'active' | 'locked'
  createdAt: string
}

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'DOC-101',
    name: 'ThS. Nguyễn Minh An',
    email: 'chuyenvien@mindcare.vn',
    phone: '0912 345 678',
    specialty: 'Tham vấn Lo âu & Trầm cảm',
    status: 'active',
    createdAt: '15/01/2026',
  },
  {
    id: 'DOC-102',
    name: 'BS. CKII Lê Hoàng Nam',
    email: 'lehoangnam@mindcare.vn',
    phone: '0988 777 666',
    specialty: 'Tâm lý Học đường & Áp lực',
    status: 'active',
    createdAt: '20/01/2026',
  },
  {
    id: 'DOC-103',
    name: 'ThS. Phạm Thu Trang',
    email: 'phamthutrang@mindcare.vn',
    phone: '0933 111 222',
    specialty: 'Trị liệu Gia đình & Mối quan hệ',
    status: 'active',
    createdAt: '01/02/2026',
  },
]

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

const write = <T,>(key: string, value: T) => {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value))
}

export const getAssessments = () => read<MindAssessment[]>('mind-care-assessments', [])
export const saveAssessment = (assessment: MindAssessment) => write('mind-care-assessments', [assessment, ...getAssessments()])
export const getBookings = () => read<MindBooking[]>('mind-care-bookings', [])
export const saveBooking = (booking: MindBooking) => write('mind-care-bookings', [booking, ...getBookings()])
export const updateBooking = (booking: MindBooking) => write('mind-care-bookings', getBookings().map((item) => item.id === booking.id ? booking : item))
export const getClinicalRecords = () => read<ClinicalRecord[]>('mind-care-clinical-records', [])
export const saveClinicalRecord = (record: ClinicalRecord) => write('mind-care-clinical-records', [record, ...getClinicalRecords()])
export const getCarePlans = () => read<CarePlan[]>('mind-care-care-plans', [])
export const saveCarePlan = (plan: CarePlan) => write('mind-care-care-plans', [plan, ...getCarePlans()])
export const getFamilyMembers = () => read<FamilyMember[]>('mind-care-family-members', [])
export const saveFamilyMembers = (members: FamilyMember[]) => write('mind-care-family-members', members)
export const getDoctors = () => read<Doctor[]>('mind-care-doctors', DEFAULT_DOCTORS)
export const saveDoctor = (doc: Doctor) => write('mind-care-doctors', [doc, ...getDoctors()])
export const updateDoctor = (doc: Doctor) => write('mind-care-doctors', getDoctors().map((d) => d.id === doc.id ? doc : d))
export const getMood = () => read<number | null>('mind-care-mood', null)
export const saveMood = (mood: number) => write('mind-care-mood', mood)
export const getHomework = () => read<Record<string, boolean>>('mind-care-homework', {})
export const saveHomework = (value: Record<string, boolean>) => write('mind-care-homework', value)

