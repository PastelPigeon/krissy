import { createContext, ReactNode, useContext, useState } from "react"
import { join } from "@tauri-apps/api/path";
import { exists, readTextFile } from "@tauri-apps/plugin-fs";

type KrissyInstallationInfoType = {
  installedPacks: {
    chapterID: number,
    packName: string,
    version: number,
    background: string
  }[],
  hasBackup: boolean
}

type LocalGameInfoContextType = {
  localGameInfo: {
    isInvalidPath: boolean
    hasInstalled: boolean,
    info: KrissyInstallationInfoType
  },
  path: string,
  updatePath: (path: string) => void,
  isLoading: boolean
}

const LocalGameInfoContext = createContext<LocalGameInfoContextType | null>(null)

function LocalGameInfoProvider(props: {children: ReactNode}){
  const [isLoading, setIsLoading] = useState(true)
  const [path, setPath] = useState("")
  const [localGameInfo, setLocalGameInfo] = useState<{
    isInvalidPath: boolean
    hasInstalled: boolean,
    info: KrissyInstallationInfoType
  }>({
    isInvalidPath: true,
    hasInstalled: false,
    info: {
      installedPacks: [],
      hasBackup: false
    }
  })

  const updateLocalGameInfo = async () => {
    if (await exists(await join(path, "DELTARUNE.exe"))){
      if (await exists(await join(path, ".krissy.json"))){
        setLocalGameInfo(
          {
            isInvalidPath: false,
            hasInstalled: true,
            info: JSON.parse(await readTextFile(await join(path, ".krissy.json")))
          }
        )
      } else {
        setLocalGameInfo(
          {
            isInvalidPath: false,
            hasInstalled: false,
            info: {
              installedPacks: [],
              hasBackup: false
            }
          }
        )
      }
    } else {
      setLocalGameInfo(
        {
          isInvalidPath: true,
          hasInstalled: false,
          info: {
            installedPacks: [],
            hasBackup: false
          }
        }
      )
    }

    setIsLoading(false)
  }

  const updatePath = (path: string) => {
    setLocalGameInfo(
      {
        isInvalidPath: true,
        hasInstalled: false,
        info: {
          installedPacks: [],
          hasBackup: false
        }
      }
    )

    setIsLoading(true)

    setPath(path)
    updateLocalGameInfo()
  }

  const contextValue = {
    localGameInfo,
    path,
    updatePath,
    isLoading
  }

  return(
    <LocalGameInfoContext.Provider value={contextValue}>
      {props.children}
    </LocalGameInfoContext.Provider>
  )
}

function useLocalGameInfo(){
  const context = useContext(LocalGameInfoContext);
  if (!context) {
    throw new Error('useLocalGameInfo must be used within a LocalGameInfoProvider');
  }
  return context;
};

export { LocalGameInfoProvider, useLocalGameInfo }