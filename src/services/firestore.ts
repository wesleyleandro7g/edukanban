import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'

import { firestore } from '../lib/firebase'
import {
  Classroom,
  Infraction,
  Student,
  StudentCouncilEvaluation,
  UserNotification,
} from '../models'

const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => Object.assign({}, data),
  fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>) =>
    snap.data() as T,
})

const dataPoint = <T>(collectionPath: string) =>
  collection(firestore, collectionPath).withConverter(converter<T>())

export const db = {
  classrooms: dataPoint<Omit<Classroom, 'id'>>('classrooms'),
  students: dataPoint<Omit<Student, 'id'>>('students'),
  classroomInfractions: (classroom_id: string) =>
    dataPoint<Omit<Infraction, 'id'>>(`classrooms/${classroom_id}/infractions`),
  studentCouncilEvaluations: (student_id: string) =>
    dataPoint<Omit<StudentCouncilEvaluation, 'id'>>(
      `students/${student_id}/council_evaluations`,
    ),
  notifications: dataPoint<Omit<UserNotification, 'id'>>('notifications'),
}
