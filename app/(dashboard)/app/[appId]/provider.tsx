import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode
} from 'react'

export enum AppActionKind {
  addedCustomInstructions = 'SET_INSTRUCTIONS'
}

interface PropsAction {
  type: AppActionKind
  payload: string
}

type AppProps = {
  customInstructions: string
}

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

export function useProps() {
  return useContext(PropsContext)
}

export function usePropsDispatch() {
  return useContext(PropsDispatchContext)
}

function propsReducer(props: AppProps, action: PropsAction): AppProps {
  switch (action.type) {
    case 'SET_INSTRUCTIONS':
      return {
        ...props,
        customInstructions: action.payload
      }
    default:
      throw Error('Unknown action: ' + action.type)
  }
}

const initialProps = {
  customInstructions: ''
}
