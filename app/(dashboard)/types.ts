export enum AppActionKind {
  SET_INSTRUCTIONS = 'SET_INSTRUCTIONS'
}

export interface PropsAction {
  type: AppActionKind
  payload: string
}

export type AppProps = {
  customInstructions: string
}

export type ChatResponseChunk = {
  message: { content: string }
  done: boolean
}
