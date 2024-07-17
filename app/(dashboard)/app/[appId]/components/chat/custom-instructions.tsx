'use client'

import React, { FC, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

import { usePropsDispatch } from '@/app/(dashboard)/app/[appId]/provider'
import { AppActionKind } from '@/app/(dashboard)/types'

import { useTranslation } from '@/app/i18n/client'

const CustomInstructions: FC = () => {
  const { t } = useTranslation('custom-instructions')

  const [customInstructions, setCustomInstructions] = useState('')
  const dispatch = usePropsDispatch()
  if (!dispatch) {
    throw new Error(
      'Dispatch is null. Please ensure PropsProvider is correctly set up.'
    )
  }

  return (
    <Textarea
      className="h-[330px]"
      placeholder={t('customInstructionsPlaceholder')}
      value={customInstructions}
      onChange={(e) => {
        setCustomInstructions(e.target.value)
        dispatch({
          type: AppActionKind.SET_INSTRUCTIONS,
          payload: e.target.value
        })
      }}
    />
  )
}

export default React.memo(CustomInstructions)
