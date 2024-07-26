'use client'

import React, { FC } from 'react'

import CustomInstructions from './custom-instructions'
import ChatArea from './chat-area'

import { PropsProvider } from '@/app/(dashboard)/app/[appId]/provider'

type ChatMainProps = {
  user: {
    name?: string | null | undefined
    email?: string | null | undefined
  }
}

const ChatMain: FC<ChatMainProps> = ({ user }) => {
  return (
    <PropsProvider userName={user.name ?? ''}>
      <div className="flex">
        <div className="mr-4 w-1/2">
          <CustomInstructions />
        </div>
        <div className="w-1/2 rounded-lg border">
          <ChatArea />
        </div>
      </div>
    </PropsProvider>
  )
}

export default React.memo(ChatMain)
