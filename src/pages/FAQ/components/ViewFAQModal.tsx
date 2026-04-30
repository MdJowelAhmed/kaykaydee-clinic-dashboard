import { HelpCircle, MessageSquare, Calendar } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import type { FAQ } from '@/types'
import { formatDateTime } from '@/utils/formatters'

interface ViewFAQModalProps {
  open: boolean
  onClose: () => void
  faq: FAQ | null
}

export function ViewFAQModal({ open, onClose, faq }: ViewFAQModalProps) {
  if (!faq) return null

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="FAQ Details"
      size="lg"
      className="max-w-2xl bg-card"
    >
      <div className="space-y-6">
        {/* FAQ Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-accent mb-2">
            FAQ Information
          </h2>
        </div>

        {/* Question */}
        <Card className="border border-border bg-background/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Question</p>
                <p className="font-medium text-accent">{faq.question}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer */}
        <Card className="border border-border bg-background/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Answer</p>
                <p className="text-sm text-accent/80 whitespace-pre-wrap">{faq.answer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Timestamps */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Created At */}
            <Card className="border border-border bg-background/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Created At</p>
                    <p className="font-medium text-accent">
                      {formatDateTime(faq.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updated At */}
            <Card className="border border-border bg-background/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                    <p className="font-medium text-accent">
                      {formatDateTime(faq.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            onClick={onClose}
            className="bg-secondary hover:bg-secondary/90 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

