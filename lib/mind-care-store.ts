'use client'

export type MindAssessment = {
  id: string
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
  counselor: string
  specialty: string
  date: string
  time: string
  mode: 'online' | 'offline'
  status: 'upcoming' | 'completed'
}

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
export const getMood = () => read<number | null>('mind-care-mood', null)
export const saveMood = (mood: number) => write('mind-care-mood', mood)
export const getHomework = () => read<Record<string, boolean>>('mind-care-homework', {})
export const saveHomework = (value: Record<string, boolean>) => write('mind-care-homework', value)
