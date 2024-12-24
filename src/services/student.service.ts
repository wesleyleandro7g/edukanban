import {
  addDoc,
  arrayUnion,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { useMutation, useQuery } from 'react-query'

import { queryClient } from '../lib/react-query'
import { Student } from '../models'
import { db } from './firestore'

const queryKey = ['students']

export function useCreateStudentMutation() {
  return useMutation(
    async (data: Omit<Student, 'id' | 'guardians_id'>) => {
      const { id } = await addDoc(db.students, data)

      return {
        id,
        guardians_id: [],
        ...data,
      }
    },
    {
      onSuccess: (newStudent) => {
        const students = queryClient.getQueryData<Student[]>(queryKey)

        if (!students) return

        const updatedStudents = students
          ? [...students, newStudent]
          : newStudent

        queryClient.setQueryData(queryKey, updatedStudents)
      },
    },
  )
}

export function useGetAllStudentsQuery() {
  return useQuery(
    queryKey,
    async () => {
      const querySnapshot = await getDocs(db.students)

      const students = querySnapshot.docs.map((student) => ({
        id: student.id,
        ...student.data(),
      }))

      return students
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
}

export function useDeleteStudentMutation() {
  return useMutation(
    async (user_id: string) => {
      await deleteDoc(doc(db.students, user_id))

      return user_id
    },
    {
      onSuccess: (deletedStudentId) => {
        const students = queryClient.getQueryData<Student[]>(queryKey)

        if (students) {
          const updatedStudents = students.filter(
            (student) => student.id !== deletedStudentId,
          )

          queryClient.setQueryData(queryKey, updatedStudents)
        }
      },
    },
  )
}

export function useAddGuardianToStudentMutation() {
  return useMutation(
    async ({
      student_id,
      guardian_id,
    }: {
      student_id: string
      guardian_id: string
    }) => {
      await updateDoc(doc(db.students, student_id), {
        guardians_id: arrayUnion(guardian_id),
      })
    },
    {
      onMutate: ({ student_id, guardian_id }) => {
        const students = queryClient.getQueryData<Student[]>(queryKey)
        if (students) {
          const updatedStudents = students.map((student) => {
            if (student.id === student_id) {
              return {
                ...student,
                guardians_id: student.guardians_id
                  ? [...student.guardians_id, guardian_id]
                  : [guardian_id],
              }
            } else {
              return student
            }
          })
          queryClient.setQueryData(queryKey, updatedStudents)
        }

        return () => queryClient.setQueryData(queryKey, students)
      },
    },
  )
}

export async function createStudentCouncilEvaluation(
  student_id: string,
  topics: string[],
) {
  await addDoc(db.studentCouncilEvaluations(student_id), {
    topics,
    date: new Date().toISOString(),
  })
}
