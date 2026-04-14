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
      className="max-w-2xl bg-white"
    >
      <div className="space-y-6">
        {/* FAQ Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            FAQ Information
          </h2>
        </div>

        {/* Question */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Question</p>
                <p className="font-medium text-gray-900">{faq.question}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Answer</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Timestamps */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Created At */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(faq.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updated At */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(faq.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

