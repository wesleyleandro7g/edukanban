import { IconButton } from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Trash, WhatsappLogo } from 'phosphor-react'
import { useParams } from 'react-router-dom'

import { Table } from '../../components/Table'
import * as userService from '../../services/user.service'
import { dateFormatter } from '../../utils/formatter'
import { UserSwitch } from './components/UserSwitch'

export function UserList() {
  const { type } = useParams()
  const { data: users } = userService.useGetAllUsersQuery()
  const { mutate: deleteUserMutate } = userService.useDeleteUserMutation()

  const handleDeleteClick = (user_id: string) => () => {
    deleteUserMutate(user_id)
  }

  const roleToString: Record<string, string> = {
    Diretor: 'diretores',
    Professor: 'professores',
    Responsável: 'responsaveis',
  }

  const columns: GridColDef[] = [
    { field: 'name', width: 300, headerName: 'Nome' },
    { field: 'created_at', width: 250, headerName: 'Data de Cadastro' },
    { field: 'role', width: 200, headerName: 'Tipo de Conta' },
    {
      field: 'active',
      headerName: 'Ativo',
      renderCell: (params) => (
        <UserSwitch userId={params.id as string} checked={params.value} />
      ),
    },
    {
      field: 'whatsapp',
      headerName: 'WhatsApp',
      renderCell: (params) => {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          )

        const whatsappLink = isMobile
          ? `https://api.whatsapp.com/send?phone=${params.value}`
          : `https://web.whatsapp.com/send?phone=${params.value}`

        return (
          <IconButton
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsappLogo className="text-white" />
          </IconButton>
        )
      },
    },
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
    users
      ?.map((user) => {
        return {
          id: user.uid,
          name: user.displayName,
          created_at: dateFormatter.format(
            new Date(user.metadata.creationTime as string),
          ),
          role: user.customClaims?.role,
          active: !user.disabled,
          whatsapp: user.phoneNumber,
        }
      })
      .filter(({ active, role }) => {
        if (type === 'bloqueados') {
          return !active
        }

        const roleStr = roleToString[role ?? '']

        return type === roleStr
      }) ?? []

  return (
    <Table columns={columns} rows={rows}>
      <h2 className="pl-6 text-xl font-bold py-6">
        {type === 'bloqueados'
          ? 'Usuários Bloqueados'
          : type === 'diretores'
          ? 'Diretores'
          : type === 'professores'
          ? 'Professores'
          : 'Responsáveis'}
      </h2>
    </Table>
  )
}
