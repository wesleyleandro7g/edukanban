import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/react-query'
import { Router } from './Router'

import './styles/global.css'

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
