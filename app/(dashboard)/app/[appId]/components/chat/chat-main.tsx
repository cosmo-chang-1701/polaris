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
      <div className="grid grid-rows-2 gap-4 sm:grid-cols-2">
        <div>
          <CustomInstructions />
        </div>
        <div className="row-span-2 rounded-lg border">
          <ChatArea />
        </div>
      </div>
    </PropsProvider>
  )
}

export default React.memo(ChatMain)
