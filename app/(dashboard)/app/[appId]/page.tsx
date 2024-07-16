import { auth } from '@/auth'

import React, { FC } from 'react'

import ChatMain from './components/chat/chat-main'

const Page: FC = async () => {
  const session = await auth()
  if (!session || !session.user?.name || !session.user?.email) {
    return
  }

  return <ChatMain user={session.user} />
}

export default React.memo(Page)
