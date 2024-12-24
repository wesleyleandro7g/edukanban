import { GridActionsCellItem, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Trash } from 'phosphor-react'

import { Table } from '../../components/Table'
import * as classroomService from '../../services/classroom.service'
import * as studentService from '../../services/student.service'
import * as userService from '../../services/user.service'

export function StudentList() {
  const { data: students } = studentService.useGetAllStudentsQuery()
  const { data: classrooms } = classroomService.useGetAllClassroomsQuery()
  const { data: users } = userService.useGetAllUsersQuery()
  const { mutate: deleteStudentMutate } =
    studentService.useDeleteStudentMutation()
  const { mutate: updateClassroomStudentsCountMutate } =
    classroomService.useUpdateClassroomStudentsCountMutation()

  const handleDeleteClick = (student_id: string) => () => {
    const student = students!.find(({ id }) => id === student_id)

    deleteStudentMutate(student_id)
    updateClassroomStudentsCountMutate({
      classroom_id: student!.classroom_id,
      value: -1,
    })
  }

  const columns: GridColDef[] = [
    { field: 'name', width: 250, headerName: 'Nome' },
    { field: 'class', width: 250, headerName: 'Turma' },
    { field: 'registration', headerName: 'Matrícula' },
    { field: 'guardians', width: 300, headerName: 'Responsáveis' },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      renderCell: ({ id }) => (
        <GridActionsCellItem
          icon={<Trash />}
          label="Delete"
          title="Deletar"
          onClick={handleDeleteClick(id as string)}
        />
      ),
    },
  ]

  const rows: GridRowsProp =
    students?.map(({ id, name, classroom_id, registration, guardians_id }) => {
      const classroom = classrooms?.find(({ id }) => id === classroom_id)

      return {
        id,
        name,
        class: `${classroom?.grade} - ${classroom?.name} - ${classroom?.level}`,
        registration,
        guardians: users
          ?.filter((user) => guardians_id?.includes(user.uid))
          .map(({ displayName }) => displayName)
          .join(', '),
      }
    }) || []

  return (
    <Table columns={columns} rows={rows}>
      <h2 className="pl-6 text-xl font-bold py-6">Alunos</h2>
    </Table>
  )
}
