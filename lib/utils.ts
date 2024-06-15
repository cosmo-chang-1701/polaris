import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { ChatResponseChunk } from '@/app/(dashboard)/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function postAndStream(
  url: string,
  data: object,
  onChunkReceived: (dataChunk: ChatResponseChunk) => void
): Promise<void> {
  const response = await fetch(url, {
    body: JSON.stringify(data),
    method: 'POST'
  })

  // Checking if the response is not ok
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')

  // If the reader cannot be obtained, throw an error
  if (!reader) {
    throw new Error('Unable to get reader from response body')
  }

  let done = false
  // Reading the response stream in a loop until done
  while (!done) {
    const { done: doneReading, value } = await reader.read()
    done = doneReading
    if (value) {
      const chunk = decoder.decode(value, { stream: true })
      // Process the chunk using the provided callback
      onChunkReceived(JSON.parse(chunk))
    }
  }
}
