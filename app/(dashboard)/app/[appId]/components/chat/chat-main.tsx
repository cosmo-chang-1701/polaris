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
      <div className="flex flex-col md:flex-row">
        <div className="mr-4 w-full sm:w-1/2">
          <CustomInstructions />
        </div>
        <div className="h-[700px] w-full rounded-lg border sm:w-1/2">
          <ChatArea />
        </div>
      </div>
    </PropsProvider>
  )
}

export default React.memo(ChatMain)
