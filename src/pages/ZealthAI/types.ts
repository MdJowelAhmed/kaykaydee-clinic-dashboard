export type ZealthMessageRole = 'user' | 'assistant'

export interface ZealthMessage {
  id: string
  role: ZealthMessageRole
  content: string
  createdAt: string
}

export interface ZealthChatState {
  messages: ZealthMessage[]
}

