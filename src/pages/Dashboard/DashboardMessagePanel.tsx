import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { FileIcon, ImageIcon, Paperclip, SendHorizontal, Smile } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'

type ChatMessage =
  | { id: string; kind: 'text'; text: string; sentAt: number }
  | { id: string; kind: 'image'; src: string; alt: string; sentAt: number }
  | { id: string; kind: 'file'; fileName: string; sentAt: number }

const EMOJI_QUICK = ['😀', '😊', '👍', '🙏', '💪', '❤️', '✨', '🔥', '👋', '🎉', '😅', '🤝']

function newId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function DashboardMessagePanel() {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [emojiOpen, setEmojiOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputId = useId()
  const fileInputId = useId()

  const scrollToBottom = useCallback(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const appendMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const sendText = useCallback(() => {
    const text = draft.trim()
    if (!text) {
      toast.error('Type a message first')
      return
    }
    appendMessage({
      id: newId(),
      kind: 'text',
      text,
      sentAt: Date.now(),
    })
    setDraft('')
  }, [draft, appendMessage])

  const onPickImage = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const onImageSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file || !file.type.startsWith('image/')) {
        if (file) toast.error('Please choose an image file')
        return
      }
      try {
        const src = await readFileAsDataUrl(file)
        appendMessage({
          id: newId(),
          kind: 'image',
          src,
          alt: file.name,
          sentAt: Date.now(),
        })
        toast.success('Image added to chat')
      } catch {
        toast.error('Could not read image')
      }
    },
    [appendMessage]
  )

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return
      appendMessage({
        id: newId(),
        kind: 'file',
        fileName: file.name,
        sentAt: Date.now(),
      })
      toast.success(`Attached “${file.name}”`)
    },
    [appendMessage]
  )

  const insertEmoji = useCallback((emoji: string) => {
    setDraft((d) => d + emoji)
    setEmojiOpen(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="flex h-full min-h-0 flex-col"
    >
      <Card className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Message</h2>
          <p className="text-sm text-slate-500">30 members available</p>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 pt-0">
          <input
            id={imageInputId}
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onImageSelected}
          />
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={onFileSelected}
          />

          <div
            ref={listRef}
            className={cn(
              'min-h-[200px] flex-1 overflow-y-auto rounded-xl border border-slate-200/90',
              'bg-slate-50/80 px-3 py-3 sm:min-h-[260px]'
            )}
          >
            {messages.length === 0 ? (
              <p className="flex h-full min-h-[180px] items-center justify-center px-4 text-center text-sm text-slate-500">
                No messages yet. Send a message, image, or file below.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.li
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                          'bg-violet-600 text-white'
                        )}
                      >
                        {m.kind === 'text' && (
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        )}
                        {m.kind === 'image' && (
                          <div className="space-y-2">
                            <img
                              src={m.src}
                              alt={m.alt}
                              className="max-h-48 w-full max-w-xs rounded-lg object-contain"
                            />
                            <p className="text-xs text-violet-100">{m.alt}</p>
                          </div>
                        )}
                        {m.kind === 'file' && (
                          <div className="flex items-center gap-2 text-white">
                            <FileIcon className="h-4 w-4 shrink-0" />
                            <span className="break-all font-medium">{m.fileName}</span>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 shadow-sm focus-within:ring-2 focus-within:ring-violet-500/20">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendText()
                  }
                }}
                placeholder="Ask a follow up"
                className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-slate-500"
                    aria-label="Insert emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end" side="top">
                  <div className="grid grid-cols-6 gap-1">
                    {EMOJI_QUICK.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-lg hover:bg-slate-100"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-slate-500"
                aria-label="Send image"
                onClick={onPickImage}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-slate-500"
                aria-label="Attach file"
                onClick={onPickFile}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </div>
            <Button
              type="button"
              className="h-11 shrink-0 gap-2 rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-700"
              onClick={sendText}
            >
              <SendHorizontal className="h-4 w-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
