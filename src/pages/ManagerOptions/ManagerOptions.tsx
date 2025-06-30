import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { InstallationInfoKey, useInstallationInfo } from "../../hooks/useInstallationInfo";
import { useLocalGameInfo } from "../../hooks/useLocalGameInfo";

export default function ManagerOptions(){
  const [action, setAction] = useState<"reinstall" | "uninstall">("reinstall")

  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { updateInstallationInfo, installationInfo  } = useInstallationInfo()
  const { localGameInfo } = useLocalGameInfo()

  const optionsInfo = [
    {
      action: "reinstall",
      name: "修改或更新",
      description: "修改或更新已经安装的翻译包"
    },
    {
      action: "uninstall",
      name: "卸载",
      description: "卸载已经安装的翻译包，此操作会将您的游戏完全还原为原版"
    }
  ]

  useEffect(() => {
    updateInstallationInfo(InstallationInfoKey.action, action)

    updateNextFunc(() => {
      if (action == "reinstall"){
        if (localGameInfo.info.hasBackup){
          navToPage(10)
        } else {
          navToPage(13)
        }
      } else {
        if (localGameInfo.info.hasBackup){
          navToPage(11)
        } else {
          navToPage(14)
        }
      }
    })
  }, [action])

  return(
    <div className="manager-options">
      <PageHeader title="选择操作" description="您选择的游戏路径中已有翻译安装，请选择您要对已安装的翻译进行的操作"/>

      <div className="options">
        {
          optionsInfo.map((optionInfo) => {
            return(
              <div className="option" data-selected={optionInfo.action == action} onClick={() => {
                if (action != optionInfo.action){
                  setAction(optionInfo.action as "reinstall" | "uninstall")
                }
              }}>
                <label className="name">{optionInfo.name}</label>
                <label className="description">{optionInfo.description}</label>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}