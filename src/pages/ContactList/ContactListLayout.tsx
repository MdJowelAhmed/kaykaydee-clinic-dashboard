import { Outlet } from 'react-router-dom'
import { ContactEntriesProvider } from './ContactEntriesContext'

export function ContactListLayout() {
  return (
    <ContactEntriesProvider>
      <Outlet />
    </ContactEntriesProvider>
  )
}

