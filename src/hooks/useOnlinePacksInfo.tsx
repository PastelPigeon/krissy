import { createContext, ReactNode, useContext, useState } from "react"
import { useInstallationInfo } from "./useInstallationInfo"

type OnlinePacksInfoType = {
  readme: string,
  availablePacks: {
    chapterID: number,
    packName: string,
    version: number,
    background: string,
    downloadURL: string,
    backupsInfo: {
      patched: string,
      backup: string
    }[]
  }[]
}

type OnlinePacksInfoContextType = {
  onlinePacksInfo: OnlinePacksInfoType | null,
  isLoading: boolean,
  hasError: boolean,
  requestOnlinePacksInfo: () => void
}

const OnlinePacksInfoContext = createContext<OnlinePacksInfoContextType | null>(null)

function OnlinePacksInfoProvider(props: {children: ReactNode}){
  const [onlinePacksInfo, setOnlinePacksInfo] = useState<OnlinePacksInfoType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  const { installationInfo } = useInstallationInfo()

  const requestOnlinePacksInfo = async () => {
    setIsLoading(true)

    const response = await fetch(installationInfo.mirrorID == 0 ? import.meta.env.VITE_ONLINE_PACKS_INFO_SOURCE : import.meta.env.VITE_ONLINE_PACKS_INFO_SOURCE_CHINA)

    if (response.ok){
      setOnlinePacksInfo(await response.json())
      setHasError(false)
    } else {
      setOnlinePacksInfo(null)
      setHasError(true)
    }

    setIsLoading(false)
  }

  const contextValue = {
    onlinePacksInfo,
    isLoading,
    hasError,
    requestOnlinePacksInfo
  }

  return(
    <OnlinePacksInfoContext.Provider value={contextValue}>
      {props.children}
    </OnlinePacksInfoContext.Provider>
  )
}

function useOnlinePacksInfo(){
  const context = useContext(OnlinePacksInfoContext);
  if (!context) {
    throw new Error('useOnlinePacksInfo must be used within a OnlinePacksInfoProvider');
  }
  return context;
};

export { OnlinePacksInfoProvider, useOnlinePacksInfo }