import { useState } from "react";
import { useInstallationInfo } from "./useInstallationInfo";
import { useOnlinePacksInfo } from "./useOnlinePacksInfo";
import useTmpDownload from "./useTmpDownload";
import useUnzip from "./useUnzip";
import { useCommands } from "./useCommands";
import { join } from "@tauri-apps/api/path";
import { useNewLocalGameInstallationInfo } from "./useNewLocalGameInstallationInfo";
import { copyFile, mkdir, readDir, remove, stat } from "@tauri-apps/plugin-fs";
import { useLocalGameInfo } from "./useLocalGameInfo";

const backupsInfo = [
  {
    chapterID: 0,
    info: [
      {
        patched: "/data.win",
        backup: "/data.win.bak"
      }
    ]
  },
  {
    chapterID: 3,
    info: [
      {
        patched: "/chapter3_windows/data.win",
        backup: "/chapter3_windows/data.win.bak"
      },
      {
        patched: "/chapter3_windows/lang",
        backup: "/chapter3_windows/lang.bak"
      },
      {
        patched: "/chapter3_windows/vid",
        backup: "/chapter3_windows/vid.bak"
      }
    ]
  },
  {
    chapterID: 4,
    info: [
      {
        patched: "/chapter4_windows/data.win",
        backup: "/chapter4_windows/data.win.bak"
      },
      {
        patched: "/chapter4_windows/lang",
        backup: "/chapter4_windows/lang.bak"
      }
    ]
  }
]

async function copyDir(from: string, to: string): Promise<void> {
  // 确保源目录存在
  const stats = await stat(from);
  if (!stats.isDirectory) {
    throw new Error(`${from} is not a directory`);
  }

  // 创建目标目录（递归创建，忽略已存在）
  await mkdir(to, { recursive: true });

  // 读取源目录内容
  const entries = await readDir(from);

  // 并行处理所有条目
  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = await join(from, entry.name);
      const destPath = await join(to, entry.name);

      if (entry.isDirectory) {
        // 递归处理子目录
        await copyDir(srcPath, destPath);
      } else if (entry.isFile ) {
        // 处理文件和符号链接
        await copyFile(srcPath, destPath);
      }
      // 注意：忽略其他类型（如 FIFO、socket 等）
    })
  );
}

function useInstall(){
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const { installationInfo } = useInstallationInfo()
  const { onlinePacksInfo } = useOnlinePacksInfo()
  const { downloadTmpFiles, cleanDownloads } = useTmpDownload()
  const { unzip, cleanZips } = useUnzip()
  const { runCommands, killCommands } = useCommands()
  const { createNewInfo } = useNewLocalGameInstallationInfo()
  const { localGameInfo } = useLocalGameInfo()

  const updateProgress = (delta: number) => {
    setProgress(prev => (prev + delta))
  }

  const updateLogs = (log: string) => {
    setLogs(prev => ([
      ...prev,
      log
    ]))
  }

  const newinstall = async (): Promise<number> => {
    updateLogs("正在开始安装")
    updateProgress(1)

    updateLogs("正在获取翻译包url")

    let selectedPackUrls: string[] = []

    installationInfo.selectedPacks.forEach((selectedPackId) => {
      const targetPack = onlinePacksInfo?.availablePacks.filter((onlinePackInfo) => onlinePackInfo.chapterID == selectedPackId)[0]
      selectedPackUrls.push(targetPack!.downloadURL)
      updateLogs(`包名: ${targetPack!.packName} 下载url: ${targetPack!.downloadURL}`)
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
      const command = `powershell ${await join(unzippedZipPath, "install.ps1")} -GamePath ${installationInfo.gamePath} ${installationInfo.backupEnabled == true && "-CreateBackup"}`
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

    return 0
  }

  const uninstall = async (): Promise<number> => {
    updateLogs("正在开始卸载")

    await Promise.all(
      localGameInfo.info.installedPacks.map(async (installPack) => {
        const backupInfo = backupsInfo.filter((backupInfo) => {return backupInfo.chapterID == installPack.chapterID})[0].info

        await Promise.all(
          backupInfo.map(async (backupInfoItem) => {
            const absPatchedPath = await join(installationInfo.gamePath, backupInfoItem.patched)
            const absBackupPath = await join(installationInfo.gamePath, backupInfoItem.backup)

            if ((await stat(absPatchedPath)).isFile == true){
              await copyFile(absBackupPath, absPatchedPath)
              await remove(absBackupPath)
            } else {
              await copyDir(absBackupPath, absPatchedPath)
              await remove(absBackupPath, {recursive: true})
            }
          })
        )
      })
    )

    const absInfoPath = await join(installationInfo.gamePath, ".krissy.json")
    await remove(absInfoPath)

    updateLogs("卸载完成！")
    updateProgress(3)

    return 0
  }

  const install = async () => {
    switch (installationInfo.action){
      case "install":
        {
          await newinstall()
          break
        }
      case "reinstall":
        {
          await uninstall()
          await newinstall()
          break
        }
      case "uninstall":
        {
          await uninstall()
          break
        }
    }
  }

  return { install, logs, progress }
}

export { useInstall } 