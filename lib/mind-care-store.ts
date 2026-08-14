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
  status: 'upcoming' | 'completed'
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
export const getMood = () => read<number | null>('mind-care-mood', null)
export const saveMood = (mood: number) => write('mind-care-mood', mood)
export const getHomework = () => read<Record<string, boolean>>('mind-care-homework', {})
export const saveHomework = (value: Record<string, boolean>) => write('mind-care-homework', value)
