/**
 * Browser-safe ID generator.
 * Uses `crypto.randomUUID` when available, otherwise falls back to a RFC4122-ish v4 string.
 */
export function createId(): string {
  const c = globalThis.crypto as Crypto | undefined

  if (c && typeof (c as any).randomUUID === 'function') {
    return (c as any).randomUUID()
  }

  // Fallback: use getRandomValues if present
  if (c && typeof c.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    c.getRandomValues(bytes)
    // Per RFC4122 v4
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  // Last resort (non-crypto)
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

