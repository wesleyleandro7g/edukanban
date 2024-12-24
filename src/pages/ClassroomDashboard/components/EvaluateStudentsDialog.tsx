import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AutocompleteInput } from '../../../components/AutocompleteInput'
import { DatePickerInput } from '../../../components/DatePickerInput'
import { TextInput } from '../../../components/TextInput'
import { infractions } from '../../../data'
import { Student } from '../../../models'
import * as classroomService from '../../../services/classroom.service'

const newClassFoulFormSchema = z.object({
  infraction: z.object({
    label: z.string(),
    value: z.string(),
  }),
  date: z.string().min(1),
  location: z.string().min(1),
})

type NewClassFoulFormInputs = z.infer<typeof newClassFoulFormSchema>

interface EvaluateStudentsDialogProps {
  open: boolean
  onClose: () => void
  classroom_id: string
  selectedStudents: Student[]
}

export function EvaluateStudentsDialog({
  open,
  onClose,
  classroom_id,
  selectedStudents,
}: EvaluateStudentsDialogProps) {
  const { handleSubmit, control, reset } = useForm<NewClassFoulFormInputs>({
    resolver: zodResolver(newClassFoulFormSchema),
  })

  const { mutate: createClassroomInfractionMutate } =
    classroomService.useCreateClassroomInfractionMutation(classroom_id)

  const students_id = selectedStudents.map(({ id }) => id as string)

  async function handleRegisterInfraction({
    infraction: { value },
    ...data
  }: NewClassFoulFormInputs) {
    createClassroomInfractionMutate({
      code: value,
      students_id,
      ...data,
    })

    reset()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="body">
      <DialogTitle className="text-center text-red-600">
        REGISTRAR UMA FALTA
      </DialogTitle>
      <DialogContent className="flex flex-col gap-8">
        <div>
          <h5>Estudantes:</h5>
          {selectedStudents &&
            selectedStudents.map(({ name, id }) => <h6 key={id}>{name}</h6>)}
        </div>

        <form
          onSubmit={handleSubmit(handleRegisterInfraction)}
          className="grid grid-cols-2 gap-6"
        >
          <div className="col-span-2">
            <AutocompleteInput
              label="O que aconteceu?"
              name="infraction"
              control={control}
              options={infractions}
            />
          </div>

          <TextInput
            label="Onde aconteceu?"
            name="location"
            control={control}
          />

          <DatePickerInput
            label="Quando aconteceu?"
            name="date"
            control={control}
          />

          <div className="col-span-2 flex justify-between">
            <button
              type="submit"
              className="relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirmar
            </button>
            <button
              onClick={onClose}
              type="button"
              className="relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sair
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
