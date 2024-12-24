import { GridColDef, GridRowsProp, GridSelectionModel } from '@mui/x-data-grid'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Table } from '../../../components/Table'
import * as studentService from '../../../services/student.service'
import * as userService from '../../../services/user.service'
import { ClassCouncilDialog } from './ClassCouncilDialog'
import { EvaluateStudentsDialog } from './EvaluateStudentsDialog'

export function StudentTable() {
  const [open, setOpen] = useState(false)
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

  const { id } = useParams()

  const { data: students } = studentService.useGetAllStudentsQuery()
  const { data: users } = userService.useGetAllUsersQuery()

  const columns: GridColDef[] = [
    { field: 'name', width: 250, headerName: 'Aluno', editable: true },
    { field: 'registration', headerName: 'Mátricula', editable: true },
    { field: 'guardians', width: 200, headerName: 'Responsáveis' },
    {
      field: 'studentClassCouncilButton',
      flex: 1,
      minWidth: 150,
      align: 'right',
      headerName: '',
      renderCell: (params) => {
        const [open, setOpen] = useState(false)

        return (
          <>
            <button
              type="submit"
              className="relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setOpen(true)}
            >
              Conselho
            </button>
            <ClassCouncilDialog
              open={open}
              onClose={() => setOpen(false)}
              student={params.value}
            />
          </>
        )
      },
    },
  ]

  const rows: GridRowsProp =
    students
      ?.filter(({ classroom_id }) => classroom_id === id)
      .map((student) => {
        const { id, name, registration, guardians_id } = student

        return {
          id,
          name,
          registration,
          guardians: users
            ?.filter((user) => guardians_id?.includes(user.uid))
            .map(({ displayName }) => displayName)
            .join(', '),
          studentClassCouncilButton: student,
        }
      }) ?? []

  const selectedStudents =
    students?.filter(({ id }) => selectionModel.includes(id)) ?? []

  return (
    <Table
      columns={columns}
      rows={rows}
      checkboxSelection
      onSelectionModelChange={(newSelectionModel) => {
        setSelectionModel(newSelectionModel)
      }}
      selectionModel={selectionModel}
    >
      <div className="flex px-6 justify-between items-center">
        <h2 className="text-xl font-bold py-6">Alunos</h2>

        <button
          type="submit"
          className="group relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setOpen(true)}
        >
          Avaliar
        </button>

        <EvaluateStudentsDialog
          open={open}
          onClose={() => setOpen(false)}
          classroom_id={id as string}
          selectedStudents={selectedStudents}
        />
      </div>
    </Table>
  )
}
