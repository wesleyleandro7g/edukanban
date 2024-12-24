import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  increment,
  updateDoc,
} from 'firebase/firestore'
import { useMutation, useQueries, useQuery } from 'react-query'

import { queryClient } from '../lib/react-query'
import { Classroom, Infraction } from '../models'
import { computeInfractionScore } from '../utils/compute-infraction-score'
import { db } from './firestore'

const queryKey = ['classrooms']

export function useCreateClassroomMutation() {
  return useMutation(
    async (data: Omit<Classroom, 'id' | 'students_count'>) => {
      const { id } = await addDoc(db.classrooms, { ...data, students_count: 0 })

      return {
        id,
        students_count: 0,
        ...data,
      }
    },
    {
      onSuccess: (newClassroom) => {
        const classrooms = queryClient.getQueryData<Classroom[]>(queryKey)

        if (!classrooms) return

        const updatedClassrooms = classrooms
          ? [...classrooms, newClassroom]
          : newClassroom

        queryClient.setQueryData(queryKey, updatedClassrooms)
      },
    },
  )
}

export function useGetAllClassroomsQuery() {
  return useQuery(
    queryKey,
    async () => {
      const querySnapshot = await getDocs(db.classrooms)

      const classrooms = querySnapshot.docs.map((classroom) => ({
        id: classroom.id,
        ...classroom.data(),
      }))

      return classrooms
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
}

export function useDeleteClassroomtMutation() {
  return useMutation(
    async (classroom_id: string) => {
      await deleteDoc(doc(db.classrooms, classroom_id))

      return classroom_id
    },
    {
      onSuccess: (deletedClassroomId) => {
        const classrooms = queryClient.getQueryData<Classroom[]>(queryKey)

        if (classrooms) {
          const updatedClassrooms = classrooms.filter(
            (classroom) => classroom.id !== deletedClassroomId,
          )

          queryClient.setQueryData(queryKey, updatedClassrooms)
        }
      },
    },
  )
}

export function useUpdateClassroomStudentsCountMutation() {
  return useMutation(
    async ({
      classroom_id,
      value,
    }: {
      classroom_id: string
      value: number
    }) => {
      await updateDoc(doc(db.classrooms, classroom_id), {
        students_count: increment(value),
      })
    },
    {
      onMutate: ({ classroom_id, value }) => {
        const classrooms = queryClient.getQueryData<Classroom[]>(queryKey)
        if (classrooms) {
          const updatedClassrooms = classrooms.map((classroom) => {
            if (classroom.id === classroom_id) {
              return {
                ...classroom,
                students_count: classroom.students_count + value,
              }
            } else {
              return classroom
            }
          })
          queryClient.setQueryData(queryKey, updatedClassrooms)
        }

        return () => queryClient.setQueryData(queryKey, classrooms)
      },
    },
  )
}

export function useCreateClassroomInfractionMutation(classroom_id: string) {
  return useMutation(
    async ({
      code,
      students_id,
      ...data
    }: Omit<Infraction, 'id' | 'score'>) => {
      const score = computeInfractionScore(code, students_id.length)

      const { id } = await addDoc(db.classroomInfractions(classroom_id), {
        code,
        score,
        students_id,
        ...data,
      })

      return {
        id,
        code,
        score,
        students_id,
        ...data,
      }
    },
    {
      onSuccess: (newInfraction) => {
        const classroomInfractions = queryClient.getQueryData<Classroom[]>([
          ...queryKey,
          classroom_id,
          'infractions',
        ])

        const updatedClassroomInfractions = classroomInfractions
          ? [...classroomInfractions, newInfraction]
          : newInfraction

        queryClient.setQueryData(
          [...queryKey, classroom_id, 'infractions'],
          updatedClassroomInfractions,
        )
      },
    },
  )
}

export function useGetAllInfractionsQuery() {
  const { data: classrooms } = useGetAllClassroomsQuery()

  const queries = classrooms?.map((classroom) => ({
    queryKey: [...queryKey, classroom.id, 'infractions'],
    queryFn: async () => {
      const querySnapshot = await getDocs(db.classroomInfractions(classroom.id))

      const infractions = querySnapshot.docs.map((infraction) => ({
        id: infraction.id,
        ...infraction.data(),
      }))

      return infractions
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }))

  const results = useQueries(queries ?? [])

  const InfractionsByClassroomId = results.reduce((acc, result, index) => {
    const classroomId = classrooms?.[index].id ?? ''
    acc[classroomId] = result.data ?? []
    return acc
  }, {} as Record<string, Infraction[]>)

  return InfractionsByClassroomId
}
