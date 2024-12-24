import { useLocation, useParams } from 'react-router-dom'

import * as classroomService from '../services/classroom.service'
import { useAuth } from '../contexts/AuthContext'
import { UserAvatar } from './UserAvatar'
import { UserNotifications } from './UserNotifications'

export function NavBar() {
  const { user } = useAuth()

  const location = useLocation()
  const { id: classroom_id } = useParams()

  const { data: classrooms } = classroomService.useGetAllClassroomsQuery()

  let pageTitle

  if (
    location.pathname === '/lista-turmas' ||
    location.pathname === '/nova-turma'
  ) {
    pageTitle = 'Turmas'
  } else if (location.pathname.includes('aluno')) {
    pageTitle = 'Alunos'
  } else if (location.pathname.includes('usuario')) {
    pageTitle = 'Usuários'
  } else if (location.pathname.includes('turma')) {
    const classroom = classrooms?.find(({ id }) => id === classroom_id)

    pageTitle = `Turma ${classroom?.grade} - ${classroom?.name} - ${classroom?.level}`
  } else {
    pageTitle = 'Edukanban'
  }

  return (
    <header className="bg-indigo-600 w-full px-10 max-sm:px-2.5">
      <div className="flex justify-end items-center gap-8 py-5 text-white font-bold">
        <UserNotifications />
        <div className="flex items-center gap-2">
          <UserAvatar />
          <span className="max-sm:hidden">{user?.displayName}</span>
        </div>
      </div>
      <h1 className="text-white font-extrabold text-3xl pt-10 pb-28">
        {pageTitle}
      </h1>
    </header>
  )
}
