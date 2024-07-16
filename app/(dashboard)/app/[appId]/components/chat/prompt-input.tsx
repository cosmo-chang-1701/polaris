'use client'

import React, { FC, useState } from 'react'
import { useProps } from '@/app/(dashboard)/app/[appId]/provider'

import { ChatMessageChunk, ChatMessage } from '@/app/(dashboard)/types'

import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { SendHorizontal } from 'lucide-react'

import { useTranslation } from '@/app/i18n/client'

import type { ToastProps } from '@/components/ui/toast'

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
  const [inputPrompt, setInputPrompt] = useState('')
  const { toast } = useToast()

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

  // Function to handle sending a message
  async function handleSendMessage() {
    setInputPrompt('')
    onAddPrompt({
      role: 'user',
      content: inputPrompt
    })
    fetchChatMessage()
  }

  return (
    <div className="relative flex items-center px-5">
      <Input
        type="message"
        value={inputPrompt}
        placeholder={t('messageInputPlaceholder')}
        onChange={(e) => setInputPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (Object.is(e.key, 'Enter')) handleSendMessage()
        }}
      />
      <SendHorizontal
        className={cn([
          'cursor-pointe absolute right-8 text-gray-400',
          {
            'cursor-pointer text-black': inputPrompt.length > 0
          }
        ])}
        onClick={handleSendMessage}
      />
    </div>
  )
}

export default React.memo(PromptInput)
