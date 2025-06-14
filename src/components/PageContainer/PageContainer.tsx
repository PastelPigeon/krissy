import type { ReactNode } from "react"
import { usePage } from "../../hooks/usePage"
import Welcome from "../../pages/Welcome/Welcome"
import GamePathSelector from "../../pages/GamePathSelector/GamePathSelector"
import NewInstallation from "../../pages/NewInstallation/NewInstallation"
import ManagerOptions from "../../pages/ManagerOptions/ManagerOptions"
import InvalidGamePath from "../../pages/InvalidGamePath/InvalidGamePath"

const pages: ReactNode[] = [
  <Welcome/>,
  <GamePathSelector/>,
  <NewInstallation/>,
  <ManagerOptions/>,
  <InvalidGamePath/>
]

export default function PageContainer(){
  const { pageIndex } = usePage()

  return(
    <div className="page-container">
      {pages[pageIndex]}
    </div>
  )
}