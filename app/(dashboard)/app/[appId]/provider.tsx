import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode
} from 'react'

import type { PropsAction, AppProps } from '@/app/(dashboard)/types'

const PropsContext = createContext<AppProps | null>(null)
const PropsDispatchContext = createContext<Dispatch<PropsAction> | null>(null)

export function PropsProvider({ children }: { children: ReactNode }) {
  const [props, dispatch] = useReducer(propsReducer, initialProps)

  return (
    <PropsContext.Provider value={props}>
      <PropsDispatchContext.Provider value={dispatch}>
        {children}
      </PropsDispatchContext.Provider>
    </PropsContext.Provider>
  )
}

// Custom hook to access the current application props from context
export function useProps() {
  return useContext(PropsContext)
}

// Custom hook to access the dispatch function for actions from context
export function usePropsDispatch() {
  return useContext(PropsDispatchContext)
}

// Reducer function to handle state updates based on dispatched actions
function propsReducer(props: AppProps, action: PropsAction): AppProps {
  switch (action.type) {
    case 'SET_INSTRUCTIONS':
      return {
        ...props,
        customInstructions: action.payload
      }
    default:
      throw Error(`Unknown action: ${action.type}`)
  }
}

const initialProps = {
  customInstructions: ''
}
