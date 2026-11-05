import type { Course } from '../types'
import { backendInterviewLab } from './backend-interview-lab'
import { disegno } from './disegno'

// A new course = one data file in this folder + one line here.
export const courses: Course[] = [backendInterviewLab, disegno]

export const courseById = (id: string): Course | undefined => courses.find((c) => c.id === id)
