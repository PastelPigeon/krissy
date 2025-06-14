import type { ReactNode } from "react"
import { usePage } from "../../hooks/usePage"
import Welcome from "../../pages/Welcome/Welcome"
import GamePathSelector from "../../pages/GamePathSelector/GamePathSelector"

const pages: ReactNode[] = [
  <Welcome/>,
  <GamePathSelector/>
]

export default function PageContainer(){
  const { pageIndex } = usePage()

  return(
    <div className="page-container">
      {pages[pageIndex]}
    </div>
  )
}