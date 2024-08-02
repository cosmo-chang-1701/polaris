'use client'

import React, { FC, useState, useRef, useEffect } from 'react'
import { useProps } from '@/app/(dashboard)/app/[appId]/provider'

import { ChatMessageChunk, ChatMessage } from '@/app/(dashboard)/types'

import { useToast } from '@/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { SendHorizontal } from 'lucide-react'

import { useTranslation } from '@/app/i18n/client'

import type { ToastProps } from '@/components/ui/toast'

import { useForm } from 'react-hook-form'
import { cn, postAndStream } from '@/lib/utils'

interface PromptInputProps {
  onAddPrompt: (prompt: ChatMessage) => void
  onResponse: (dataChunk: ChatMessageChunk) => void
  historyMessages: ChatMessage[]
}

const PromptInput: FC<PromptInputProps> = ({
  onAddPrompt,
  onResponse,
  historyMessages
}) => {
  const { t } = useTranslation('prompt-input')
  const { t: errorMessageT } = useTranslation('error-message')

  // Retrieve app properties using a custom hook
  const appProps = useProps()
  const [inputPrompt, setInputPrompt] = useState<string>('')
  const { toast } = useToast()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const form = useForm()

  const originTextareaHeight = useRef(0)
  // Effect to set the original height of the textarea
  useEffect(() => {
    if (textareaRef.current)
      originTextareaHeight.current = parseInt(
        textareaRef.current.style.height,
        10
      )
  }, [])

  // Effect to adjust the textarea height whenever the input prompt changes
  useEffect(() => {
    adjustHeight()
  }, [inputPrompt])

  async function fetchChatMessage() {
    try {
      await postAndStream(
        'http://localhost:11434/api/chat',
        {
          model: 'phi3',
          stream: true,
          messages: [
            {
              role: 'system',
              content: appProps?.customInstructions
            },
            ...historyMessages,
            { role: 'user', content: inputPrompt }
          ]
        },
        (chunk) => {
          onResponse(chunk)
        }
      )
    } catch (e) {
      // Handle errors by displaying a toast
      const toastProps: ToastProps & { description?: React.ReactNode } = {
        variant: 'destructive',
        title: errorMessageT('error'),
        description: errorMessageT('unknownErrorOccurred')
      }
      if (e instanceof Error) toastProps.description = e.message // Use specific error message if available
      toast(toastProps)
    }
  }

  // Function to handle keydown events in the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (Object.is(e.key, 'Enter') && e.shiftKey) {
      e.preventDefault()
      insertNewLine(e.target as HTMLTextAreaElement)
    } else if (Object.is(e.key, 'Enter')) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Function to insert a new line in the textarea
  const insertNewLine = (textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue =
      textarea.value.substring(0, start) + '\n' + textarea.value.substring(end)
    setInputPrompt(newValue)
    textarea.selectionStart = textarea.selectionEnd = start + 1
  }

  // Function to adjust the height of the textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  // Function to handle sending a message
  async function handleSendMessage() {
    if (!inputPrompt.trim()) return
    onAddPrompt({
      role: 'user',
      content: inputPrompt
    })
    setInputPrompt('')
    form.reset()
    await fetchChatMessage()
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="prompt-textarea"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex h-full max-w-full flex-1 flex-col">
                  <div className="flex w-full items-center">
                    <div className="flex w-full flex-col rounded-[26px] bg-[#f4f4f4] p-1.5 transition-colors">
                      <div className="flex items-end gap-1.5 md:gap-2">
                        <div className="flex min-w-0 flex-1 flex-col">
                          <Textarea
                            {...field}
                            ref={textareaRef}
                            value={inputPrompt}
                            placeholder={t('messageInputPlaceholder')}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            rows={1}
                            className="m-0 max-h-[25dvh] min-h-10 resize-none border-0 bg-transparent text-base"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:none rounded-full focus:outline-none focus:ring-0 active:outline-none"
                        >
                          <SendHorizontal
                            className={cn([
                              'cursor-pointe text-gray-400',
                              {
                                'cursor-pointer text-black':
                                  inputPrompt.length > 0
                              }
                            ])}
                            onClick={handleSendMessage}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default React.memo(PromptInput)
