import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  CaretDown,
  CaretUp,
  FolderUser,
  House,
  List as ListIcon,
  Student,
  UserList,
} from 'phosphor-react'
import { ReactNode, useState } from 'react'

import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as userService from '../services/user.service'

export function Sidebar() {
  const [toggleSidebar, setToggleSidebar] = useState(false)

  const { user } = useAuth()

  const { data: users } = userService.useGetAllUsersQuery()

  const role = users?.find(({ uid }) => uid === user?.uid)?.customClaims?.role

  function handleToggleSidebar() {
    setToggleSidebar((prev) => !prev)
  }

  return (
    <>
      <button
        className="absolute top-8 left-4 md:hidden"
        onClick={handleToggleSidebar}
      >
        <ListIcon className="text-black" size={20} />
      </button>

      <div
        onClick={handleToggleSidebar}
        className={`fixed top-0 left-0 z-[3] w-full h-full bg-black bg-opacity-50 md:hidden ${
          !toggleSidebar && 'hidden'
        }`}
      />

      <aside
        className={`fixed md:relative top-0 left-0 z-[4] w-64 min-h-screen overflow-y-auto ease-in-out duration-300 bg-zinc-50 ${
          toggleSidebar ? 'max:mdtranslate-x-0' : 'max-md:-translate-x-full'
        } max-md:h-full`}
      >
        <List>
          <Link to="/">
            <ListItemButton>
              <ListItemIcon>
                <House className="text-indigo-600" size={20} weight="fill" />
              </ListItemIcon>
              <ListItemText primary="Início" />
            </ListItemButton>
          </Link>
          <Divider />

          {role !== 'Responsável' && (
            <>
              <ListItemDropdown
                label="Turmas"
                icon={
                  <FolderUser
                    className="text-indigo-600"
                    size={20}
                    weight="fill"
                  />
                }
              >
                <List>
                  <Link to="/lista-turmas">
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={handleToggleSidebar}
                    >
                      <ListItemText primary="Listar Turmas" />
                    </ListItemButton>
                  </Link>
                  {role !== 'Professor' && (
                    <Link to="/nova-turma">
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={handleToggleSidebar}
                      >
                        <ListItemText primary="Cadastrar Turma" />
                      </ListItemButton>
                    </Link>
                  )}
                </List>
              </ListItemDropdown>
              <ListItemDropdown
                label="Alunos"
                icon={
                  <Student
                    className="text-indigo-600"
                    size={20}
                    weight="fill"
                  />
                }
              >
                <List>
                  <Link to="/lista-alunos">
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={handleToggleSidebar}
                    >
                      <ListItemText primary="Listar Alunos" />
                    </ListItemButton>
                  </Link>
                  <Link to="/novo-aluno">
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={handleToggleSidebar}
                    >
                      <ListItemText primary="Cadastrar Aluno" />
                    </ListItemButton>
                  </Link>
                  <Link to="/importar-alunos">
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={handleToggleSidebar}
                    >
                      <ListItemText primary="Importar Alunos" />
                    </ListItemButton>
                  </Link>
                </List>
              </ListItemDropdown>
            </>
          )}

          {role === 'Admin' && (
            <ListItemDropdown
              label="Usuários"
              icon={
                <UserList className="text-indigo-600" size={20} weight="fill" />
              }
            >
              <List>
                <Link to="/novo-usuario">
                  <ListItemButton sx={{ pl: 4 }} onClick={handleToggleSidebar}>
                    <ListItemText primary="Cadastrar Usuário" />
                  </ListItemButton>
                </Link>
                <Link to="/usuarios/bloqueados">
                  <ListItemButton sx={{ pl: 4 }} onClick={handleToggleSidebar}>
                    <ListItemText primary="Usuários Bloqueados" />
                  </ListItemButton>
                </Link>
                <Link to="/usuarios/diretores">
                  <ListItemButton sx={{ pl: 4 }} onClick={handleToggleSidebar}>
                    <ListItemText primary="Lista de Diretores" />
                  </ListItemButton>
                </Link>
                <Link to="/usuarios/professores">
                  <ListItemButton sx={{ pl: 4 }} onClick={handleToggleSidebar}>
                    <ListItemText primary="Lista de Professores" />
                  </ListItemButton>
                </Link>
                <Link to="/usuarios/responsaveis">
                  <ListItemButton sx={{ pl: 4 }} onClick={handleToggleSidebar}>
                    <ListItemText primary="Lista de Responsáveis" />
                  </ListItemButton>
                </Link>
              </List>
            </ListItemDropdown>
          )}
        </List>
      </aside>
    </>
  )
}

interface DropdownProps {
  label: string
  icon: ReactNode
  children: ReactNode
}

function ListItemDropdown({ label, icon, children }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
        {open ? <CaretUp /> : <CaretDown />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  )
}
