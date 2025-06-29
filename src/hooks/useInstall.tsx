import { useState } from "react";
import { useInstallationInfo } from "./useInstallationInfo";
import { useOnlinePacksInfo } from "./useOnlinePacksInfo";
import useTmpDownload from "./useTmpDownload";
import useUnzip from "./useUnzip";
import { useCommands } from "./useCommands";
import { join } from "@tauri-apps/api/path";
import { useNewLocalGameInstallationInfo } from "./useNewLocalGameInstallationInfo";

function useInstall(){
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const { installationInfo } = useInstallationInfo()
  const { onlinePacksInfo } = useOnlinePacksInfo()
  const { downloadTmpFiles, cleanDownloads } = useTmpDownload()
  const { unzip, cleanZips } = useUnzip()
  const { runCommands, killCommands } = useCommands()
  const { createNewInfo } = useNewLocalGameInstallationInfo()

  const updateProgress = (delta: number) => {
    setProgress(progress + delta)
  }

  const updateLogs = (log: string) => {
    setLogs(prev => ([
      ...prev,
      log
    ]))
  }

  const install = async () => {
    updateLogs("正在开始安装")
    updateProgress(1)

    updateLogs("正在获取翻译包url")

    let selectedPackUrls: string[] = []

    installationInfo.selectedPacks.forEach((selectedPackId) => {
      const targetPack = onlinePacksInfo?.availablePacks.filter((onlinePackInfo) => onlinePackInfo.chapterID == selectedPackId)[0]
      const finalDownloadURL = installationInfo.mirror != "github.com" ? `https://${installationInfo.mirror}/${targetPack!.downloadURL}` : targetPack!.downloadURL
      selectedPackUrls.push(finalDownloadURL)
      updateLogs(`包名: ${targetPack!.packName} 下载url: ${finalDownloadURL}`)
    })

    updateLogs("已获取全部包的url")
    updateProgress(1)

    updateLogs("创建下载任务")

    let downloads = await downloadTmpFiles(selectedPackUrls)

    updateLogs("已成功下载所有翻译包")
    updateProgress(3)

    let zipPaths: string[] = []

    downloads.forEach((download) => {
      zipPaths.push(download.path)
      updateLogs(`本地临时路径 ${download.path}`)
    })

    updateLogs("正在解压翻译包")

    let zips = await unzip(zipPaths)

    updateLogs("已成功解压所有翻译包")
    updateProgress(3)

    let unzippedZipPaths: string[] = []

    zips.forEach((zip) => {
      unzippedZipPaths.push(zip.tempDir ?? "")
      updateLogs(`本地临时路径 ${zip.tempDir}`)
    })

    updateLogs("正在创建安装命令")

    let commands: string[] = []

    unzippedZipPaths.forEach(async (unzippedZipPath) => {
      const command = `powershell ${await join(unzippedZipPath, "install.ps1")} -GamePath ${installationInfo.gamePath} -CreateBackup ${installationInfo.backupEnabled}`
      commands.push(command)
      updateLogs(`命令 ${command}`)
    })

    updateLogs("已成功正在创建安装命令")
    updateProgress(1)

    updateLogs("正在尝试运行安装命令")

    await runCommands(commands)

    updateLogs("运行安装命令完成")
    updateProgress(3)

    updateLogs("创建安装信息")

    await createNewInfo()

    updateProgress(1)

    updateLogs("正在执行最终清理")

    await killCommands()
    await cleanZips()
    await cleanDownloads()

    updateLogs("清理完成，安装结束")
    updateProgress(1)
  }

  return { install, logs, progress }
}

export { useInstall } 