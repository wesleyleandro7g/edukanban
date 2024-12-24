import { Outlet } from 'react-router-dom'

import { NavBar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'

export function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <NavBar />
        <main className="flex-1 px-10 pb-8 -mt-16 max-sm:px-2.5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
