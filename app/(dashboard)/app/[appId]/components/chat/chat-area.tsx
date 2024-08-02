'use client'

import React, { FC, useEffect, useRef, useState, useTransition } from 'react'

import { ChatMessageChunk, ChatMessage } from '@/app/(dashboard)/types'

import PromptInput from './prompt-input'
import MessageBlock from './message-block'

const ChatArea: FC = () => {
  const initialState = { role: 'assistant', content: '' }
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isPending, startTransition] = useTransition()
  const responseSectionRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const updateResponseMessages = (
    prevChatMessages: ChatMessage[],
    dataChunk: ChatMessageChunk
  ): ChatMessage[] => {
    const updatedMessages: ChatMessage[] = [...prevChatMessages]
    const index = updatedMessages.length - 1
    updatedMessages[index].content =
      updatedMessages[index].content + dataChunk.message.content
    return updatedMessages
  }

  const handleResponseMessage = (dataChunk: ChatMessageChunk) => {
    startTransition(() => {
      setChatMessages((prevChatMessages) =>
        updateResponseMessages(prevChatMessages, dataChunk)
      )
    })
  }

  const handleAddPrompt = (prompt: ChatMessage) => {
    setChatMessages((prevChatMessages) => {
      let updatedMessages: ChatMessage[] = [...prevChatMessages]
      updatedMessages = [...prevChatMessages, prompt, initialState]
      return updatedMessages
    })
  }

  // Handle window scroll events for auto-scrolling
  let scrollHeight = 0
  const responseSectionHeight = 630
  if (responseSectionRef.current)
    scrollHeight = responseSectionRef.current.scrollHeight
  useEffect(() => {
    // Auto-scroll to the bottom if near the end of the scrollable area
    if (bottomRef.current && scrollHeight > responseSectionHeight - 60) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [scrollHeight])

  return (
    <div className="flex h-[630px] flex-col">
      <div className="flex-1 overflow-y-auto">
        <div ref={responseSectionRef} className="px-5 py-4">
          {chatMessages.map(
            (message, index) =>
              message.content && <MessageBlock key={index} message={message} />
          )}
          <div ref={bottomRef}></div>
        </div>
      </div>
      <div className="mb-4 px-5">
        <PromptInput
          onAddPrompt={handleAddPrompt}
          onResponse={handleResponseMessage}
          historyMessages={chatMessages}
        />
      </div>
    </div>
  )
}

export default React.memo(ChatArea)
