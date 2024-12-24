import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'
import { auth } from '../lib/firebase'
import { CustomUser } from '../models'
import * as userService from '../services/user.service'

type SignInData = {
  email: string
  password: string
}

type AuthContextType = {
  user: CustomUser | null
  logIn: (data: SignInData) => Promise<void>
  logOut: () => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<CustomUser | null>('user', null)

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        userService.getUser(user.uid).then((user) => {
          setUser(user)
        })
      } else {
        setUser(null)
      }
    })

    return subscriber
  }, [])

  async function logIn({ email, password }: SignInData) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut() {
    await signOut(auth)
  }

  const value = useMemo(() => ({ user, logIn, logOut }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
