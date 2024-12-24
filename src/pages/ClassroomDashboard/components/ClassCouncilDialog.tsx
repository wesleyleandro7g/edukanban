import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { useState } from 'react'

import { classCouncilTopics } from '../../../data'
import * as studentService from '../../../services/student.service'
import * as notificationService from '../../../services/notification.service'
import { Student } from '../../../models'

interface ClassCouncilDialogProps {
  open: boolean
  onClose: () => void
  student: Student
}

export function ClassCouncilDialog({
  open,
  onClose,
  student,
}: ClassCouncilDialogProps) {
  const [checkboxValues, setCheckboxValues] = useState<{
    [key: string]: boolean
  }>({})

  const handleCheckboxChange = (value: string) => {
    setCheckboxValues({ ...checkboxValues, [value]: !checkboxValues[value] })
  }

  const handleSubmit = () => {
    const checkedValues = Object.entries(checkboxValues)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (!checkedValues.length) return

    studentService.createStudentCouncilEvaluation(student.id, checkedValues)

    student.guardians_id?.forEach((guardian_id) => {
      notificationService.createUserNotification({
        user_id: guardian_id,
        title: `Conselho de classe`,
        body: `O estudante foi avaliado nos seguintes tópicos: ${classCouncilTopics
          .filter(({ value }) => checkedValues.includes(value))
          .map(({ label }) => label)
          .join('; ')}.`,
      })
    })

    setCheckboxValues({})
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm' scroll='body'>
      <DialogTitle className='text-center text-red-600'>
        Conselho de Classe
        <strong className='block'>{student.name}</strong>
      </DialogTitle>
      <DialogContent className='space-y-6'>
        <FormGroup className='w-1/2 h-96'>
          {classCouncilTopics.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  checked={!!checkboxValues[value]}
                  onChange={() => handleCheckboxChange(value)}
                />
              }
              label={label}
            />
          ))}
        </FormGroup>

        <div className='flex justify-between'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Confirmar
          </button>

          <button
            onClick={onClose}
            type='button'
            className='relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Sair
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
