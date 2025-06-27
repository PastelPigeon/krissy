import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { InstallationInfoKey, useInstallationInfo } from "../../hooks/useInstallationInfo";

export default function EnableBackup(){
  const [backupEnabled, setBackupEnabled] = useState(true)

  const { navToPage } = usePage()
  const { updateNextFunc } = useNextButton()
  const { updateInstallationInfo } = useInstallationInfo()

  useEffect(() => {
    updateNextFunc(() => {
      updateInstallationInfo(InstallationInfoKey.backupEnabled, backupEnabled)
      navToPage(10)
    })
  }, [backupEnabled])

  return(
    <div className="enable-backup">
      <PageHeader title="选择是否启用备份" description="选择是否启用备份，启用备份后，安装程序会自动在游戏目录下生成data.win.bak文件，用于还原游戏或更新翻译包，启用备份会导致游戏体积增大，但不启用备份，您将无法还原游戏或管理翻译包"/>
      <div className="option">
        <input type="checkbox" className="checkbox" onClick={(e) => {setBackupEnabled(!e.currentTarget.checked)}} data-checked={backupEnabled} defaultChecked/>
        <label className="name">是否启用备份</label>
      </div>
    </div>
  )
}