import { Outlet } from 'react-router-dom'
import { ClientListEntriesProvider } from './ClientListEntriesContext'

export function ClientListLayout() {
  return (
    <ClientListEntriesProvider>
      <Outlet />
    </ClientListEntriesProvider>
  )
}
