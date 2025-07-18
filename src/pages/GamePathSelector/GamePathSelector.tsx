import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { useLocalGameInfo } from "../../hooks/useLocalGameInfo";
import { InstallationInfoKey, useInstallationInfo } from "../../hooks/useInstallationInfo";
import { open } from "@tauri-apps/plugin-dialog";

export default function GamePathSelector(){
  const [path, setPath] = useState("")
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { localGameInfo, updatePath, isLoading } = useLocalGameInfo()
  const { updateInstallationInfo } = useInstallationInfo()

  useEffect(() => {
    updateNextFunc(() => {
      updatePath(path)
    })
  }, [path])

  useEffect(() => {
    if (isLoading == false){
      if (localGameInfo.isInvalidPath == false){
        updateInstallationInfo(InstallationInfoKey.gamePath, path)
        if (localGameInfo.hasInstalled == false){
          updateInstallationInfo(InstallationInfoKey.action, "install")
          navToPage(2)
        } else {
          navToPage(3)
        }
      } else {
        navToPage(4)
      }
    }
  }, [isLoading])

  return(
    <div className="game-path-selector">
      <PageHeader title="设置游戏路径" description="将游戏路径填入下方输入框中，该路径必须包含DELTARUNE.EXE，您可以在资源管理器中手动查找，或使用STEAM进行查找"/>
      <div className="option">
        <label className="name">游戏路径</label>
        <div className="input-group">
          <input className="input" onInput={(e) => {setPath(e.currentTarget.value)}} value={path}/>
          <button className="selector-button" onClick={() => {
            open({directory: true}).then((selectedPath) => {
              setPath(selectedPath ?? "")
            })
          }}>...</button>
        </div>
      </div>
    </div>
  )
}