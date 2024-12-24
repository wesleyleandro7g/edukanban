import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox, FormControlLabel } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'
import { ChangeEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { AutocompleteInput } from '../../components/AutocompleteInput'
import { SelectInput } from '../../components/SelectInput'
import { TextInput } from '../../components/TextInput'
import * as studentService from '../../services/student.service'
import * as userService from '../../services/user.service'

const emptyFieldMessage = 'Campo obrigatório. Por favor, preencha.'

const newUserFormSchema = z.object({
  name: z.string().min(1, emptyFieldMessage),
  email: z.string().email('Email inválido.'),
  password: z.string().min(8, 'Senha inválida. Mínimo de 8 caracteres.'),
  phoneNumber: z.string(),
  role: z.enum(['Diretor', 'Professor', 'Responsável']),
  classrooms: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  students: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
})

type NewUserFormInputs = z.infer<typeof newUserFormSchema>

export function CreateUser() {
  const [manualCredentials, setManualCredentials] = useState(true)

  const { data: students } = studentService.useGetAllStudentsQuery()
  const { mutate: addGuardianToStudentMutate } =
    studentService.useAddGuardianToStudentMutation()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<NewUserFormInputs>({
    resolver: zodResolver(newUserFormSchema),
  })

  const studentOptions =
    students?.map(({ id, name }) => {
      return {
        value: id,
        label: name,
      }
    }) ?? []

  async function handleCreateUser({
    name,
    email,
    password,
    phoneNumber,
    role,
    students,
  }: NewUserFormInputs) {
    try {
      const user = await userService.useCreateUserMutation({
        name,
        email,
        password,
        phoneNumber,
        role,
      })

      if (role === 'Responsável') {
        students?.forEach(async ({ value: student_id }) => {
          addGuardianToStudentMutate({ student_id, guardian_id: user.uid })
        })
      }

      reset()
    } catch (err) {
      console.log(err)
    }
  }

  async function handleManualCredentials(event: ChangeEvent<HTMLInputElement>) {
    // setManualCredentials(event.target.checked)
  }

  const role = watch('role')

  return (
    <div className="flex flex-col gap-12 bg-white rounded-md px-6 py-6">
      <h2 className="text-2xl font-bold">Novo Usuário</h2>

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleCreateUser)}
      >
        <>
          <TextInput name="name" label="Nome" control={control} />

          <SelectInput
            name="role"
            label="Função"
            control={control}
            options={[
              { label: 'Diretor(a)', value: 'Diretor' },
              { label: 'Professor(a)', value: 'Professor' },
              { label: 'Resposável', value: 'Responsável' },
            ]}
          />

          {role === 'Professor' && (
            <AutocompleteInput
              name="classrooms"
              label="Turmas"
              multiple
              control={control}
              options={[]}
            />
          )}

          {role === 'Responsável' && (
            <AutocompleteInput
              name="students"
              label="Alunos"
              multiple
              control={control}
              options={studentOptions}
            />
          )}

          <div>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MuiTelInput
                  fullWidth
                  defaultCountry="BR"
                  value={value}
                  onChange={onChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
          </div>

          <FormControlLabel
            label="Usar Credenciais Manuais"
            control={
              <Checkbox
                checked={manualCredentials}
                onChange={handleManualCredentials}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />

          {manualCredentials && (
            <>
              <TextInput name="email" label="Email" control={control} />

              <TextInput name="password" label="Senha" control={control} />
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting && 'cursor-not-allowed'
            }`}
          >
            Cadastrar
          </button>
        </>
      </form>
    </div>
  )
}
