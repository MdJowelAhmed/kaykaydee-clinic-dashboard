import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { INITIAL_CONTACT_LIST } from './contactListData'
import type { ContactEntry } from './types'

const STORAGE_KEY = 'kaykaydee-clinic-dashboard-contacts-v1'

function loadEntries(): ContactEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_CONTACT_LIST
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return INITIAL_CONTACT_LIST
    return parsed as ContactEntry[]
  } catch {
    return INITIAL_CONTACT_LIST
  }
}

export function nextContactIdNo(entries: ContactEntry[]): string {
  const nums = entries.map((e) => parseInt(e.idNo, 10)).filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 645
  return String(max + 1)
}

interface ContactEntriesContextValue {
  entries: ContactEntry[]
  setEntries: React.Dispatch<React.SetStateAction<ContactEntry[]>>
  findById: (id: string) => ContactEntry | undefined
  upsert: (entry: ContactEntry) => void
  remove: (id: string) => void
}

const ContactEntriesContext = createContext<ContactEntriesContextValue | null>(null)

export function ContactEntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ContactEntry[]>(loadEntries)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      /* ignore */
    }
  }, [entries])

  const findById = useCallback((id: string) => entries.find((e) => e.id === id), [entries])

  const upsert = useCallback((entry: ContactEntry) => {
    setEntries((prev) => {
      const i = prev.findIndex((e) => e.id === entry.id)
      if (i === -1) return [entry, ...prev]
      const next = [...prev]
      next[i] = entry
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = useMemo(
    () => ({ entries, setEntries, findById, upsert, remove }),
    [entries, findById, upsert, remove]
  )

  return <ContactEntriesContext.Provider value={value}>{children}</ContactEntriesContext.Provider>
}

export function useContactEntries() {
  const ctx = useContext(ContactEntriesContext)
  if (!ctx) throw new Error('useContactEntries must be used within ContactEntriesProvider')
  return ctx
}

