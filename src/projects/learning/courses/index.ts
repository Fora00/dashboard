import type { Course } from '../types'
import { backendInterviewLab } from './backend-interview-lab'
import { pythonPath } from './python-path'
import { databasesPath } from './databases-path'
import { apiPath } from './api-path'
import { disegno } from './disegno'

// A new course = one data file in this folder + one line here.
export const courses: Course[] = [backendInterviewLab, pythonPath, databasesPath, apiPath, disegno]

export const courseById = (id: string): Course | undefined => courses.find((c) => c.id === id)
