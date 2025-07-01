import { create, writeTextFile } from "@tauri-apps/plugin-fs"
import { useInstallationInfo } from "./useInstallationInfo"
import { useOnlinePacksInfo } from "./useOnlinePacksInfo"
import { join } from "@tauri-apps/api/path"

function useNewLocalGameInstallationInfo(){
  const { onlinePacksInfo } = useOnlinePacksInfo()
  const { installationInfo } = useInstallationInfo()

  const createNewInfo = async () => {
    const selectedPacksInfo = onlinePacksInfo?.availablePacks.filter((onlinePackInfo) => installationInfo.selectedPacks.includes(onlinePackInfo.chapterID))

    const installedPacks = selectedPacksInfo?.map((selectedPackInfo) => {
      return(
        {
          chapterID: selectedPackInfo.chapterID,
          packName: selectedPackInfo.packName,
          version: selectedPackInfo.version,
          background: selectedPackInfo.background,
          backupsInfo: selectedPackInfo.backupsInfo
        }
      )
    })

    const info = {
      installedPacks: installedPacks,
      hasBackup: installationInfo.backupEnabled
    }

    const infoFilePath = await join(installationInfo.gamePath, ".krissy.json")
    const infoFile = await create(infoFilePath)
    infoFile.close()
    await writeTextFile(infoFilePath, JSON.stringify(info))
  }

  return { createNewInfo }
}

export { useNewLocalGameInstallationInfo }