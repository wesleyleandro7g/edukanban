import { httpsCallable } from 'firebase/functions'
import { useMutation, useQuery } from 'react-query'

import { functions } from '../lib/firebase'
import { queryClient } from '../lib/react-query'
import { CustomUser } from '../models'

const queryKey = ['users']

const createUser = httpsCallable(functions, 'createUser')
const readUsers = httpsCallable(functions, 'readUsers')
const readUser = httpsCallable(functions, 'readUser')
const toogleUserState = httpsCallable(functions, 'toogleUserState')
const deleteUser = httpsCallable(functions, 'deleteUser')

interface CreateUserData {
  name: string
  email: string
  password: string
  phoneNumber: string
  role: string
}

// implement this function with react query
export async function useCreateUserMutation(createUserData: CreateUserData) {
  const { data: user_id } = await createUser(createUserData)
  const { data } = await readUser({ user_id })

  const newUser = data as CustomUser

  const users = queryClient.getQueryData<CustomUser[]>(queryKey)
  const updatedUsers = users ? [...users, newUser] : newUser
  queryClient.setQueryData(queryKey, updatedUsers)

  return newUser
}

export async function getUser(user_id: string) {
  const { data } = await readUser({ user_id })
  const user = data as CustomUser
  return user
}

export function useGetAllUsersQuery() {
  return useQuery(
    queryKey,
    async () => {
      const { data: users } = await readUsers()

      return users as CustomUser[]
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
}

export function useToogleUserStateMutation() {
  return useMutation(
    async (user_id: string) => {
      await toogleUserState({ user_id })
    },
    {
      onMutate: (user_id) => {
        const users = queryClient.getQueryData<CustomUser[]>(queryKey)
        if (users) {
          const updatedUsers = users.map((user) => {
            if (user.uid === user_id) {
              return {
                ...user,
                disabled: !user.disabled,
              }
            } else {
              return user
            }
          })
          queryClient.setQueryData(queryKey, updatedUsers)
        }

        return () => queryClient.setQueryData(queryKey, users)
      },
    },
  )
}

export function useDeleteUserMutation() {
  return useMutation(
    async (user_id: string) => {
      await deleteUser({ user_id })

      return user_id
    },
    {
      onSuccess: (deletedUserId) => {
        const users = queryClient.getQueryData<CustomUser[]>(queryKey)

        if (users) {
          const updatedUsers = users.filter(
            (user) => user.uid !== deletedUserId,
          )

          queryClient.setQueryData(queryKey, updatedUsers)
        }
      },
    },
  )
}
