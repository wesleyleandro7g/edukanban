import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AutocompleteInput } from '../../components/AutocompleteInput'
import { DatePickerInput } from '../../components/DatePickerInput'
import { SelectInput } from '../../components/SelectInput'
import { TextInput } from '../../components/TextInput'
import * as classroomService from '../../services/classroom.service'
import * as studentService from '../../services/student.service'

const emptyFieldMessage = 'Campo obrigatório. Por favor, preencha.'

const newStudentFormSchema = z.object({
  name: z.string().min(1, emptyFieldMessage),
  registration: z.string().min(1, emptyFieldMessage),
  classroom: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { invalid_type_error: emptyFieldMessage },
  ),
  birthday: z.string().min(1, emptyFieldMessage),
  gender: z.string().min(1, emptyFieldMessage),
  breed: z.string().min(1, emptyFieldMessage),
})

type NewStudentFormInputs = z.infer<typeof newStudentFormSchema>

export function CreateStudent() {
  const { control, handleSubmit, reset } = useForm<NewStudentFormInputs>({
    resolver: zodResolver(newStudentFormSchema),
  })

  const { mutate: createStudentMutate } =
    studentService.useCreateStudentMutation()
  const { data: classroom } = classroomService.useGetAllClassroomsQuery()
  const { mutate: updateClassroomStudentCountMutate } =
    classroomService.useUpdateClassroomStudentsCountMutation()

  const classroomOptions =
    classroom?.map(({ id, grade, name, level, time }) => {
      return {
        value: id,
        label: `${grade} - ${name} - ${level} - ${time}`,
      }
    }) ?? []

  function handleCreateStudent({
    classroom: { value: classroom_id },
    ...data
  }: NewStudentFormInputs) {
    createStudentMutate({ ...data, classroom_id })

    updateClassroomStudentCountMutate({ classroom_id, value: 1 })

    reset()
  }

  return (
    <div className="flex flex-col gap-12 bg-white rounded-md px-6 py-6">
      <h2 className="text-2xl font-bold">Novo Aluno</h2>

      <form
        className="grid grid-cols-4 gap-6 max-lg:flex max-lg:flex-col"
        onSubmit={handleSubmit(handleCreateStudent)}
      >
        <TextInput
          className="col-span-3 max-lg:col-span-4"
          name="name"
          label="Nome do Aluno"
          control={control}
        />

        <TextInput
          className="max-lg:col-span-2"
          name="registration"
          label="Nº de Matrícula"
          control={control}
        />

        <div className="max-lg:col-span-2">
          <AutocompleteInput
            name="classroom"
            label="Turma"
            control={control}
            options={classroomOptions}
          />
        </div>

        <div className="max-lg:col-span-2">
          <DatePickerInput
            name="birthday"
            label="Data de Nascimento"
            disableTime
            control={control}
          />
        </div>

        <SelectInput
          name="gender"
          label="Gênero"
          control={control}
          options={[
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Feminino', value: 'Feminino' },
            { label: 'Outro', value: 'Outro' },
          ]}
        />

        <SelectInput
          name="breed"
          label="Raça"
          control={control}
          options={[
            { label: 'Branco', value: 'Branco' },
            { label: 'Preto', value: 'Preto' },
            { label: 'Pardo', value: 'Pardo' },
            { label: 'Amarelo', value: 'Amarelo' },
            { label: 'Indígena', value: 'Indígena' },
          ]}
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
