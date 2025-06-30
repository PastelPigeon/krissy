import type { ReactNode } from "react"
import { usePage } from "../../hooks/usePage"
import Welcome from "../../pages/Welcome/Welcome"
import GamePathSelector from "../../pages/GamePathSelector/GamePathSelector"
import NewInstallation from "../../pages/NewInstallation/NewInstallation"
import ManagerOptions from "../../pages/ManagerOptions/ManagerOptions"
import InvalidGamePath from "../../pages/InvalidGamePath/InvalidGamePath"
import DownloadingPacksInfo from "../../pages/DowloadingPacksInfo/DownloadingPacksInfo"
import README from "../../pages/README/README"
import DownloadingPacksInfoError from "../../pages/DownloadingPacksInfoError/DownloadingPacksInfoError"
import PacksSelector from "../../pages/PacksSelector/PacksSelector"
import EnableBackup from "../../pages/EnableBackup/EnableBackup"
import InstallingProgress from "../../pages/InstallingProgress/InstallingProgress"
import MirrorsSelector from "../../pages/MirrorsSelector/MirrorsSelector"
import InstallingCompleted from "../../pages/InstallingCompleted/InstallingCompleted"
import ReinstallWithoutBackupError from "../../pages/ReinstallWithoutBackupError/ReinstallWithoutBackupError"
import UninstallWithoutBackupError from "../../pages/UninstallWithoutBackupError/UninstallWithoutBackupError"

const pages: ReactNode[] = [
  <Welcome/>,
  <GamePathSelector/>,
  <NewInstallation/>,
  <ManagerOptions/>,
  <InvalidGamePath/>,
  <DownloadingPacksInfo/>,
  <README/>,
  <DownloadingPacksInfoError/>,
  <PacksSelector/>,
  <EnableBackup/>,
  <MirrorsSelector/>,
  <InstallingProgress/>,
  <InstallingCompleted/>,
  <ReinstallWithoutBackupError/>,
  <UninstallWithoutBackupError/>
]

export default function PageContainer(){
  const { pageIndex } = usePage()

  return(
    <div className="page-container">
      {pages[pageIndex]}
    </div>
  )
}