import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, SendHorizonal, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { createId } from '@/utils/id'
import { generateZealthResponse } from './aiEngine'
import { clearZealthChat, loadZealthChat, saveZealthChat } from './storage'
import type { ZealthMessage } from './types'

function formatTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function initialMessages(): ZealthMessage[] {
  const saved = loadZealthChat()
  if (saved?.messages?.length) return saved.messages
  return [
    {
      id: createId(),
      role: 'assistant',
      content: 'Hi! I’m Zealth AI. Tell me what you want to do, and I’ll help.',
      createdAt: new Date().toISOString(),
    },
  ]
}

export default function ZealthAIPage() {
  const [messages, setMessages] = useState<ZealthMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    saveZealthChat({ messages })
  }, [messages])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  const recentPrompts = useMemo(() => {
    const prompts = messages.filter((m) => m.role === 'user').slice(-6).reverse()
    return prompts
  }, [messages])

  const sendMessage = async () => {
    const text = draft.trim()
    if (!text || isTyping) return

    const userMsg: ZealthMessage = {
      id: createId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setDraft('')
    setIsTyping(true)

    // Simulate an AI response delay (replace with real API later)
    await new Promise((r) => setTimeout(r, 650))

    setMessages((prev) => {
      const replyText = generateZealthResponse(text, [...prev, userMsg])
      const assistantMsg: ZealthMessage = {
        id: createId(),
        role: 'assistant',
        content: replyText,
        createdAt: new Date().toISOString(),
      }
      return [...prev, assistantMsg]
    })
    setIsTyping(false)
  }

  const handleClear = () => {
    clearZealthChat()
    setMessages(initialMessages())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px]">
          {/* Main chat */}
          <div className="min-h-[720px] flex flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ask Your AI</p>
                  <p className="text-xs text-muted-foreground">Zealth AI</p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setClearOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-auto px-6 py-10 bg-white"
            >
              {messages.length <= 1 ? (
                <div className="max-w-2xl mx-auto text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 mx-auto flex items-center justify-center">
                    <Bot className="h-7 w-7 text-slate-700" />
                  </div>
                  <p className="mt-6 text-base text-slate-700">Hi Enrico !</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Where Should We Start?
                  </h2>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => {
                    const isUser = m.role === 'user'
                    return (
                      <div key={m.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[720px] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                            isUser
                              ? 'bg-[#9CCB6B] text-white'
                              : 'bg-slate-100 text-slate-900'
                          )}
                        >
                          {m.content}
                          <div
                            className={cn(
                              'mt-2 text-[11px]',
                              isUser ? 'text-white/80' : 'text-slate-500'
                            )}
                          >
                            {formatTime(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[520px] rounded-2xl px-4 py-3 text-sm bg-slate-100 text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:120ms]" />
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:240ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="flex items-end gap-3">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask a follow up"
                  className="min-h-[52px] max-h-[140px] resize-none bg-slate-50 rounded-2xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void sendMessage()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!draft.trim() || isTyping}
                  className="h-12 w-12 rounded-xl bg-[#6F2DBD] hover:bg-[#6F2DBD]/90 text-white p-0"
                  aria-label="Send"
                >
                  <SendHorizonal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="border-t xl:border-t-0 xl:border-l border-slate-200 bg-slate-50/30">
            <div className="p-5 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">August 2025</p>
                <div className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                  <span className="text-xs text-slate-500">📅</span>
                </div>
              </div>
              <div className="mt-4">
                <Input type="date" className="bg-white rounded-xl" />
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent prompts</p>
              <div className="mt-3 space-y-2">
                {recentPrompts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No prompts yet.</p>
                ) : (
                  recentPrompts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-left rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-colors"
                      onClick={() => setDraft(p.content)}
                    >
                      <p className="text-sm text-slate-700 line-clamp-2">{p.content}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{formatTime(p.createdAt)}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={handleClear}
        onSuccess={() => setClearOpen(false)}
        title="Clear chat"
        description="Remove all messages from this chat?"
        confirmText="Clear"
        cancelText="Cancel"
        variant="warning"
      />
    </motion.div>
  )
}

