'use client'

import React, { FC } from 'react'

import CustomInstructions from './components/custom-instructions'
import ChatArea from './components/chat-area'
import { PropsProvider } from './provider'

const Page: FC = () => {
  return (
    <PropsProvider>
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

export default React.memo(Page)
