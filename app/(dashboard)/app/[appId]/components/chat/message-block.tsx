'use client'

import React, { FC } from 'react'
import { useProps } from '@/app/(dashboard)/app/[appId]/provider'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ChatMessage } from '@/app/(dashboard)/types'

import { cn } from '@/lib/utils'

interface MessageBlockProps {
  message: ChatMessage
}

const MessageBlock: FC<MessageBlockProps> = React.memo(
  function MessageBlock({ message }) {
    const isUser = Object.is(message.role, 'user')
    return (
      <div className="mt-4">
        <div
          className={cn(['flex items-start space-x-2'], {
            'justify-end': isUser
          })}
        >
          {!isUser && <AvatarBlock isUser={isUser} />}
          <div
            className={cn([
              'max-w-xs rounded-lg p-3 text-sm',
              isUser ? 'bg-blue-200' : 'bg-gray-200'
            ])}
          >
            <p className="break-words">{message.content}</p>
          </div>
          {isUser && <AvatarBlock isUser={isUser} />}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return !Object.is(
      JSON.stringify(prevProps.message),
      JSON.stringify(nextProps.message)
    )
  }
)

function AvatarBlock({ isUser }: { isUser: boolean }) {
  const appProps = useProps()
  const avatarText = isUser
    ? appProps?.userName.slice(0, 1).toUpperCase()
    : 'AI'
  return (
    <Avatar className="h-8 w-8">
      {Object.is(isUser, false) && <AvatarImage src="/ai.jpeg" alt="AI" />}
      <AvatarFallback
        className={cn({
          'bg-black': !isUser,
          'bg-blue-500': isUser
        })}
      >
        {avatarText}
      </AvatarFallback>
    </Avatar>
  )
}

export default MessageBlock
