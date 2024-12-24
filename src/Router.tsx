import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'
import { Layout } from './layout'
import { ClassroomDashboard } from './pages/ClassroomDashboard'
import { ClassroomList } from './pages/ClassroomList'
import { CreateClassroom } from './pages/CreateClassroom'
import { CreateStudent } from './pages/CreateStudent'
import { CreateUser } from './pages/CreateUser'
import { Home } from './pages/Home'
import { ImportStudents } from './pages/ImportStudents'
import { SignIn } from './pages/SignIn'
import { StudentList } from './pages/StudentList'
import { UserList } from './pages/UserList'

export function Router() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <SignIn /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Home />} />
        {user && (
          <>
            <Route
              path="/lista-turmas"
              element={
                ['Admin', 'Diretor', 'Professor'].includes(
                  user!.customClaims.role,
                ) ? (
                  <ClassroomList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/turma/:id"
              element={
                ['Admin', 'Diretor', 'Professor'].includes(
                  user!.customClaims.role,
                ) ? (
                  <ClassroomDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/lista-alunos"
              element={
                ['Admin', 'Diretor', 'Professor'].includes(
                  user!.customClaims.role,
                ) ? (
                  <StudentList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/nova-turma"
              element={
                ['Admin', 'Diretor'].includes(user!.customClaims.role) ? (
                  <CreateClassroom />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/novo-aluno"
              element={
                ['Admin', 'Diretor', 'Professor'].includes(
                  user!.customClaims.role,
                ) ? (
                  <CreateStudent />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/importar-alunos"
              element={
                ['Admin', 'Diretor', 'Professor'].includes(
                  user!.customClaims.role,
                ) ? (
                  <ImportStudents />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/novo-usuario"
              element={
                user!.customClaims.role === 'Admin' ? (
                  <CreateUser />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/usuarios/:type"
              element={
                user!.customClaims.role === 'Admin' ? (
                  <UserList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </>
        )}

        <Route path="/*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
