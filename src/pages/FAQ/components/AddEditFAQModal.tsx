import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HelpCircle, MessageSquare } from 'lucide-react'
import { ModalWrapper } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch } from '@/redux/hooks'
import { addFAQ, updateFAQ } from '@/redux/slices/faqSlice'
import { toast } from '@/utils/toast'
import type { FAQ } from '@/types'

const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
})

type FAQFormData = z.infer<typeof faqSchema>

interface AddEditFAQModalProps {
  open: boolean
  onClose: () => void
  faq?: FAQ | null
}

export function AddEditFAQModal({ open, onClose, faq }: AddEditFAQModalProps) {
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = !!faq

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  })

  // Reset form when modal opens or FAQ changes
  useEffect(() => {
    if (open) {
      if (isEditMode && faq) {
        reset({
          question: faq.question,
          answer: faq.answer,
        })
      } else {
        reset({
          question: '',
          answer: '',
        })
      }
    }
  }, [open, isEditMode, faq, reset])

  const onSubmit = async (data: FAQFormData) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const faqData: FAQ = {
      id: isEditMode && faq ? faq.id : Date.now().toString(),
      question: data.question,
      answer: data.answer,
      position: isEditMode && faq ? faq.position : 'top-left',
      createdAt: isEditMode && faq ? faq.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditMode) {
      dispatch(updateFAQ(faqData))
      toast({
        title: 'FAQ Updated',
        description: 'FAQ has been updated successfully.',
      })
    } else {
      dispatch(addFAQ(faqData))
      toast({
        title: 'FAQ Created',
        description: 'FAQ has been created successfully.',
      })
    }

    setIsSubmitting(false)
    onClose()
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit FAQ' : 'Add New FAQ'}
      size="lg"
      className="max-w-2xl bg-white"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Question */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="question">Question</Label>
          </div>
          <Input
            id="question"
            placeholder="Enter your question"
            error={!!errors.question}
            {...register('question')}
          />
          {errors.question && (
            <p className="text-xs text-destructive">{errors.question.message}</p>
          )}
        </div>

        {/* Answer */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="answer">Answer</Label>
          </div>
          <Textarea
            id="answer"
            placeholder="Enter the answer"
            error={!!errors.answer}
            rows={5}
            {...register('answer')}
            className="resize-none"
          />
          {errors.answer && (
            <p className="text-xs text-destructive">{errors.answer.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditMode
              ? 'Save Changes'
              : 'Add FAQ'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}

