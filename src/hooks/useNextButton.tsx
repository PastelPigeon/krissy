import { createContext, useContext, useState, type ReactNode } from "react"

type NextButtonContextType = {
  nextFunc: (() => void) | null,
  updateNextFunc: (nextFunc: () => void) => void
}

const NextButtonContext = createContext<NextButtonContextType | null>(null)

function NextButtonProvider(props: {children: ReactNode}){
  const [nextFunc, setNextFunc] = useState<(() => void) | null>(null)

  //封装updateNextFunc
  const updateNextFunc = (nextFunc: () => void) => {
    setNextFunc(() => nextFunc)
  }

  const contextValue = {
    nextFunc,
    updateNextFunc
  }

  return(
    <NextButtonContext.Provider value={contextValue}>
      {props.children}
    </NextButtonContext.Provider>
  )
}

function useNextButton(){
  const context = useContext(NextButtonContext);
  if (!context) {
    throw new Error('useNextButton must be used within a NextButtonProvider');
  }
  return context;
};

export { NextButtonProvider, useNextButton }
