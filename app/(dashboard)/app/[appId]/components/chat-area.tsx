'use client'

import React, { FC, useEffect, useRef, useState, useTransition } from 'react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { ChatResponseChunk, ChatResponseMessage } from '@/app/(dashboard)/types'

import PromptInput from './prompt-input'

const ChatArea: FC = () => {
  const initialState = { role: 'assistant', content: '' }
  const [responseMessages, setResponseMessages] = useState<
    ChatResponseMessage[]
  >([initialState])
  const [isPending, startTransition] = useTransition()
  const responseSectionRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const updateResponseMessages = (
    prevMessages: ChatResponseMessage[],
    dataChunk: ChatResponseChunk
  ): ChatResponseMessage[] => {
    const updatedMessages: ChatResponseMessage[] = [...prevMessages]
    if (dataChunk.done) {
      updatedMessages.push(initialState)
    } else {
      const index = updatedMessages.length - 1
      updatedMessages[index].content =
        updatedMessages[index].content + dataChunk.message.content
    }
    return updatedMessages
  }

  const handleResponseMessage = (dataChunk: ChatResponseChunk) => {
    startTransition(() => {
      setResponseMessages((prevMessages) =>
        updateResponseMessages(prevMessages, dataChunk)
      )
    })
  }

  // Handle window scroll events for auto-scrolling
  let scrollHeight = 0
  const responseSectionHeight = 630
  if (responseSectionRef.current)
    scrollHeight = responseSectionRef.current.scrollHeight
  useEffect(() => {
    let scrollTop = 0
    if (responseSectionRef.current)
      scrollTop = responseSectionRef.current.scrollTop
    // Auto-scroll to the bottom if near the end of the scrollable area
    if (
      bottomRef.current &&
      scrollHeight > responseSectionHeight &&
      scrollHeight - scrollTop <= responseSectionHeight + 200
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scrollHeight])

  return (
    <>
      <div className="h-[630px]">
        <div
          ref={responseSectionRef}
          className={`h-[${responseSectionHeight}px] overflow-y-auto px-5 py-4`}
        >
          {responseMessages.map(
            (message, index) =>
              message.content && (
                <MessageBlock key={index} message={message.content} />
              )
          )}
          <div ref={bottomRef}></div>
        </div>
      </div>
      <div className="h-[70px] w-full py-3">
        <PromptInput onResponse={handleResponseMessage} />
      </div>
    </>
  )
}

function MessageBlock({ message }: { message: string }) {
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
