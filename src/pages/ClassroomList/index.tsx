import { GridActionsCellItem, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Trash } from 'phosphor-react'
import { Link } from 'react-router-dom'

import { Table } from '../../components/Table'
import { useAuth } from '../../contexts/AuthContext'
import * as classroomService from '../../services/classroom.service'

export function ClassroomList() {
  const { user } = useAuth()
  const { data: classrooms } = classroomService.useGetAllClassroomsQuery()
  const { mutate: deleteClassroomMutate } =
    classroomService.useDeleteClassroomtMutation()

  const handleDeleteClick = (classroom_id: string) => () => {
    if (user?.customClaims.role === 'Professor') return

    deleteClassroomMutate(classroom_id)
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      renderCell: (params) => (
        <Link className="hover:text-indigo-700" to={`/turma/${params.id}`}>
          {params.value}
        </Link>
      ),
    },
    { field: 'grade', headerName: 'Ano Escolar' },
    { field: 'level', headerName: 'Tipo de Ensino', width: 200 },
    { field: 'time', headerName: 'Turno' },
    { field: 'year', headerName: 'Ano Letivo' },
    { field: 'students_count', headerName: 'Alunos' },
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
    classrooms?.map((classroom) => {
      return classroom
    }) ?? []

  return (
    <Table columns={columns} rows={rows}>
      <h2 className="text-xl font-bold p-6">Turmas</h2>
    </Table>
  )
}
