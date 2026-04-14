import type { ZealthChatState } from './types'

const KEY = 'zealth-ai-chat:v1'

export function loadZealthChat(): ZealthChatState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as ZealthChatState
  } catch {
    return null
  }
}

export function saveZealthChat(state: ZealthChatState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function clearZealthChat() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

