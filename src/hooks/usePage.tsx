import { createContext, useContext, useState, type ReactNode } from "react"

type PageContextType = {
  pageIndex: number,
  navToPage: (pageIndex: number) => void
}

const PageContext = createContext<PageContextType | null>(null)

function PageProvider(props: {children: ReactNode}){
  const [pageIndex, setPageIndex] = useState(0)

  //切换页面封装
  const navToPage = (pageIndex: number) => {
    setPageIndex(pageIndex)
  }

  const contextValue = {
    pageIndex,
    navToPage
  }

  return(
    <PageContext.Provider value={contextValue}>
      {props.children}
    </PageContext.Provider>
  )
}

function usePage(){
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};

export { PageProvider, usePage }