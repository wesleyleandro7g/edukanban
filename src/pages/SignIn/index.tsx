import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../../contexts/AuthContext'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInFormInputs = z.infer<typeof signInFormSchema>

export function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(signInFormSchema),
  })

  const { logIn } = useAuth()
  const navigate = useNavigate()

  async function handleSignIn(data: SignInFormInputs) {
    try {
      await logIn(data)

      navigate('/')
    } catch (err: any) {
      let message

      if (err.code === 'auth/user-not-found') {
        message = 'Email não encontrado.'
      } else if (err.code === 'auth/wrong-password') {
        message = 'Email ou senha incorretos.'
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas. Por favor, tente novamente mais tarde.'
      } else {
        message = 'Algo deu errado. Por favor, tente novamente mais tarde.'
      }

      setError('root', { message })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-sm w-full space-y-8'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Entre com a sua conta
        </h2>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleSignIn)}>
          <input type='hidden' name='remember' defaultValue='true' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email
              </label>
              <input
                id='email-address'
                type='email'
                autoComplete='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Email'
                {...register('email')}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Senha
              </label>
              <input
                id='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Senha'
                {...register('password')}
              />
            </div>
          </div>

          <div className='text-xs text-red-500'>
            <span>{errors.root?.message}</span>
          </div>

          <div className='text-sm text-right'>
            <a
              href='#'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Esqueceu sua senha?
            </a>
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <Lock
                  className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                  aria-hidden='true'
                />
              </span>
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
