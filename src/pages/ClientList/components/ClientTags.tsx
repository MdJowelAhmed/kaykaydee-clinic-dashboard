import { cn } from '@/utils/cn'

/** Funding / category tags used to quickly identify a client on the list. */
export const CLIENT_TAGS = [
  'NDIS',
  'Private',
  'Medicare',
  'WorkCover',
  'DVA',
  'TAC',
  'Home Visit',
  'Telehealth',
  'Paediatric',
  'Aged Care',
] as const

export type ClientTag = (typeof CLIENT_TAGS)[number]

/** Per-tag pill colours (light bg + readable text, with dark-mode variants). */
const TAG_STYLES: Record<string, string> = {
  NDIS: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Private: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  Medicare: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  WorkCover: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  DVA: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  TAC: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  'Home Visit': 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  Telehealth: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  Paediatric: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  'Aged Care': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
}

const FALLBACK_STYLE = 'bg-slate-100 text-slate-700 dark:bg-muted dark:text-foreground'

export function ClientTagBadge({ tag, className }: { tag: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        TAG_STYLES[tag] ?? FALLBACK_STYLE,
        className
      )}
    >
      {tag}
    </span>
  )
}

export function ClientTags({ tags, className }: { tags?: string[]; className?: string }) {
  if (!tags || tags.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {tags.map((tag) => (
        <ClientTagBadge key={tag} tag={tag} />
      ))}
    </div>
  )
}
