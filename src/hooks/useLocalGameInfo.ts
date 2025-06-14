import { useState } from "react"

type KrissyInstallationInfoType = {
  installedPacks: {
    chapterID: number,
    packName: string,
    version: number,
    background: string
  }[],
  hasBackup: boolean
}

async function useLocalGameInfo(path: string){
  const [localGameInfo, setLocalGameInfo] = useState<{
    installed: boolean,
    info: KrissyInstallationInfoType,
    loading: boolean
  }>
}

export { useLocalGameInfo }