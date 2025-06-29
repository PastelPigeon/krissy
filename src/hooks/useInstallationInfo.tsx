import { createContext, ReactNode, useContext, useState } from "react"

type InstallationInfoType = {
  gamePath: string,
  action: "install" | "reinstall" | "uninstall",
  selectedPacks: number[],
  backupEnabled: boolean,
  mirrorID: number
  needLaunchingGame: boolean
}

const InstallationInfoKey = {
  gamePath: "gamePath",
  action: "action",
  selectedPacks: "selectedPacks",
  backupEnabled: "backupEnabled",
  mirrorID: "mirrorID",
  needLaunchingGame: "needLaunchingGame"
}

type InstallationInfoContextType = {
  installationInfo: InstallationInfoType,
  updateInstallationInfo: (key: string, value: any) => void
}

const InstallationInfoContext = createContext<InstallationInfoContextType | null>(null)

function InstallationInfoProvider(props: {children: ReactNode}){
  const [installationInfo, setInstallationInfo] = useState<InstallationInfoType>(
    {
      gamePath: "",
      action: "install",
      selectedPacks: [],
      backupEnabled: true,
      mirrorID: 0,
      needLaunchingGame: false
    }
  )

  const updateInstallationInfo = (key: string, value: any) => {
    setInstallationInfo(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const contextValue = {
    installationInfo,
    updateInstallationInfo
  }

  return(
    <InstallationInfoContext.Provider value={contextValue}>
      {props.children}
    </InstallationInfoContext.Provider>
  )
}

function useInstallationInfo(){
  const context = useContext(InstallationInfoContext);
  if (!context) {
    throw new Error('useInstallationInfo must be used within a InstallationInfoProvider');
  }
  return context;
};

export { InstallationInfoProvider, useInstallationInfo, InstallationInfoKey }