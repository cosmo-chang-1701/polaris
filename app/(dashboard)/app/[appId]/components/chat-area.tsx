'use client'

import React, { FC, useEffect, useRef, useTransition, useState } from 'react'

import { useProps } from '../provider'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'

import type { ToastProps } from '@/components/ui/toast'

import { useTranslation } from '@/app/i18n/client'

import { SendHorizontal } from 'lucide-react'
import { cn, postAndStream } from '@/lib/utils'

const ChatArea: FC = () => {
  const { t } = useTranslation('chat-area')
  const { t: errorMessageT } = useTranslation('error-message')
  const { toast } = useToast()

  const appProps = useProps()
  const [inputPrompt, setInputPrompt] = useState('')
  const [responseMessages, setResponseMessages] = useState<string[]>([''])
  const [isPending, startTransition] = useTransition()

  const responseSectionRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLInputElement>(null)

  let scrollHeight = 0
  const responseSectionHeight = 630
  if (responseSectionRef.current)
    scrollHeight = responseSectionRef.current.scrollHeight
  useEffect(() => {
    let scrollTop = 0
    if (responseSectionRef.current)
      scrollTop = responseSectionRef.current.scrollTop
    if (
      bottomRef.current &&
      scrollHeight > responseSectionHeight &&
      scrollHeight - scrollTop <= responseSectionHeight + 200
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scrollHeight])

  async function handleSendMessage() {
    setInputPrompt('')
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
            {
              role: 'user',
              content: inputPrompt
            }
          ]
        },
        (chunk) => {
          if (chunk.done) {
            responseMessages.push('')
          } else {
            const index = responseMessages.length - 1
            responseMessages[index] =
              responseMessages[index] + chunk.message.content
          }
          startTransition(() => {
            setResponseMessages(responseMessages)
          })
        }
      )
    } catch (e) {
      const toastProps: ToastProps & { description?: React.ReactNode } = {
        variant: 'destructive',
        title: errorMessageT('error'),
        description: errorMessageT('unknownErrorOccurred')
      }
      if (e instanceof Error) toastProps.description = e.message
      toast(toastProps)
    }
  }

  return (
    <>
      <div className="h-[630px]">
        <div
          ref={responseSectionRef}
          className={`h-[${responseSectionHeight}px] overflow-y-auto px-5 py-4`}
        >
          {responseMessages.map((message, index) => {
            if (message) return <ResponseBlock key={index} message={message} />
          })}
          <div ref={bottomRef}></div>
        </div>
      </div>
      <div className="h-[70px] w-full py-3">
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
      </div>
    </>
  )
}

function ResponseBlock({ message }: { message: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-start space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/ai.jpeg" alt="AI" />
          <AvatarFallback className="bg-black">AI</AvatarFallback>
        </Avatar>
        <div className="w-full rounded-lg bg-gray-200 p-3 text-sm">
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ChatArea)
