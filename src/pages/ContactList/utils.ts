import type { ContactEntry } from './types'

export function contactProviderIdRef(entry: ContactEntry): string {
  return `PID${entry.idNo}`
}

export function contactInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

