import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SelectInput } from '../../components/SelectInput'
import { TextInput } from '../../components/TextInput'
import * as classroomService from '../../services/classroom.service'

const emptyFieldMessage = 'Campo obrigatório. Por favor, preencha.'

const newClassroomFormSchema = z.object({
  name: z.string().min(1, emptyFieldMessage),
  level: z.enum(['Ensino Fundamental', 'Ensino Médio']),
  grade: z.string().min(1, emptyFieldMessage),
  time: z.enum(['Matutino', 'Vespertino', 'Noturno']),
  year: z
    .number({ invalid_type_error: emptyFieldMessage })
    .min(1, emptyFieldMessage),
})

type NewClassroomFormInputs = z.infer<typeof newClassroomFormSchema>

export function CreateClassroom() {
  const { control, handleSubmit, reset } = useForm<NewClassroomFormInputs>({
    resolver: zodResolver(newClassroomFormSchema),
  })

  const { mutate: createClassroomMutate } =
    classroomService.useCreateClassroomMutation()

  async function handleCreateClassroom(data: NewClassroomFormInputs) {
    createClassroomMutate(data)

    reset()
  }

  return (
    <div className="flex flex-col gap-12 bg-white rounded-md px-6 py-6">
      <h2 className="text-2xl font-bold">Nova turma</h2>

      <form
        className="grid grid-cols-4 gap-6 max-lg:flex max-lg:flex-col"
        onSubmit={handleSubmit(handleCreateClassroom)}
      >
        <TextInput
          className="col-span-3"
          name="name"
          label="Nome"
          control={control}
        />

        <SelectInput
          name="time"
          label="Turno"
          control={control}
          options={[
            { label: 'Matutino', value: 'Matutino' },
            { label: 'Vespertino', value: 'Vespertino' },
            { label: 'Noturno', value: 'Noturno' },
          ]}
        />

        <div className="col-span-2">
          <SelectInput
            name="level"
            label="Tipo de Ensino"
            control={control}
            options={[
              { label: 'Ensino Fundamental', value: 'Ensino Fundamental' },
              { label: 'Ensino Médio', value: 'Ensino Médio' },
            ]}
          />
        </div>

        <div>
          <SelectInput
            name="grade"
            label="Ano Escolar"
            control={control}
            options={[
              { label: '1º Ano', value: '1º Ano' },
              { label: '2º Ano', value: '2º Ano' },
              { label: '3º Ano', value: '3º Ano' },
              { label: '4º Ano', value: '4º Ano' },
              { label: '5º Ano', value: '5º Ano' },
              { label: '6º Ano', value: '6º Ano' },
              { label: '7º Ano', value: '7º Ano' },
              { label: '8º Ano', value: '8º Ano' },
              { label: '9º Ano', value: '9º Ano' },
            ]}
          />
        </div>

        <SelectInput
          name="year"
          label="Ano Letivo"
          control={control}
          options={[{ label: 2023, value: 2023 }]}
        />

        <button
          type="submit"
          className="group relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cadastar
        </button>
      </form>
    </div>
  )
}
