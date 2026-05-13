import { motion } from 'framer-motion'
import { Copy, Download, FileText, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import type { DocumentRow } from '../types'

interface DocumentsTableProps {
  rows: DocumentRow[]
  onCopy: (row: DocumentRow) => void
  onDownload: (row: DocumentRow) => void
  onEdit: (row: DocumentRow) => void
  onDelete: (row: DocumentRow) => void
}

const headerBg = 'bg-[#E9EBF0] dark:bg-background'
const headerCell =
  'border-x-0 border-t-0 border-b border-border px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function DocumentsTable({
  rows,
  onCopy,
  onDownload,
  onEdit,
  onDelete,
}: DocumentsTableProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-b-2xl">
      <table className="w-full min-w-[1180px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>Document</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Patient Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Patient ID</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Doctor</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Doctor ID</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Upload By</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="border-b border-border px-6 py-10 text-center text-sm text-accent">
                No documents found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.02 * index, 0.25) }}
                className="transition-colors hover:bg-muted/15"
              >
                <td className={bodyCell}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>{row.fileName}</span>
                  </div>
                </td>
                <td className={bodyCell}>{row.patientName}</td>
                <td className={bodyCell}>{row.patientId}</td>
                <td className={bodyCell}>{row.doctorName}</td>
                <td className={bodyCell}>{row.doctorId}</td>
                <td className={bodyCell}>{formatDate(row.dateIso, 'd MMM yyyy')}</td>
                <td className={bodyCell}>{row.moderator}</td>
                <td className={bodyCell}>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Copy document details"
                      onClick={() => onCopy(row)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-cyan-500 hover:bg-cyan-500/10"
                      aria-label="Download document"
                      onClick={() => onDownload(row)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-accent hover:bg-muted"
                      aria-label="Edit document"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted"
                      aria-label="Delete document"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
