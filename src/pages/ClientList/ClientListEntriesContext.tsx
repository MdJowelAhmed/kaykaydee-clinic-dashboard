import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { INITIAL_CLIENT_LIST } from './clientListData'
import type { ClientListEntry } from './types'

const STORAGE_KEY = 'kaykaydee-clinic-dashboard-clients-v1'

function loadEntries(): ClientListEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_CLIENT_LIST
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return INITIAL_CLIENT_LIST
    return parsed as ClientListEntry[]
  } catch {
    return INITIAL_CLIENT_LIST
  }
}

export function nextClientIdNo(entries: ClientListEntry[]): string {
  const nums = entries.map((e) => parseInt(e.idNo, 10)).filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 265799
  return String(max + 1)
}

interface ClientListEntriesContextValue {
  entries: ClientListEntry[]
  setEntries: React.Dispatch<React.SetStateAction<ClientListEntry[]>>
  findById: (id: string) => ClientListEntry | undefined
  upsertClient: (entry: ClientListEntry) => void
  removeClient: (id: string) => void
}

const ClientListEntriesContext = createContext<ClientListEntriesContextValue | null>(null)

export function ClientListEntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ClientListEntry[]>(loadEntries)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      /* ignore */
    }
  }, [entries])

  const findById = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries]
  )

  const upsertClient = useCallback((entry: ClientListEntry) => {
    setEntries((prev) => {
      const i = prev.findIndex((e) => e.id === entry.id)
      if (i === -1) return [entry, ...prev]
      const next = [...prev]
      next[i] = entry
      return next
    })
  }, [])

  const removeClient = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      entries,
      setEntries,
      findById,
      upsertClient,
      removeClient,
    }),
    [entries, findById, upsertClient, removeClient]
  )

  return (
    <ClientListEntriesContext.Provider value={value}>{children}</ClientListEntriesContext.Provider>
  )
}

export function useClientListEntries() {
  const ctx = useContext(ClientListEntriesContext)
  if (!ctx) {
    throw new Error('useClientListEntries must be used within ClientListEntriesProvider')
  }
  return ctx
}
