import { User } from 'firebase/auth'

export interface CustomUser extends User {
  customClaims: {
    role: string
  }
  disabled: boolean
}

export interface Classroom {
  id: string
  name: string
  level: 'Ensino Fundamental' | 'Ensino Médio'
  time: 'Matutino' | 'Vespertino' | 'Noturno'
  year: number
  grade: string
  students_count: number
}

export interface Student {
  id: string
  name: string
  registration: string
  birthday: string
  gender: string
  breed: string
  classroom_id: string
  guardians_id: string[]
}

export interface Infraction {
  id: string
  code: string
  location: string
  date: string
  score: number
  students_id: string[]
}

export interface UserNotification {
  id: string
  title: string
  body: string
  user_id: string
  readed_at: string | null
  created_at: string
}

export interface StudentCouncilEvaluation {
  id: string
  topics: string[]
  date: string
}
