import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function ReinstallWithoutBackupError(){
  const { updateNextFunc } = useNextButton()

  useEffect(() => {
    updateNextFunc(() => {
      appWindow.close()
    })
  }, [])

  return(
    <div className="reinstall-without-backup-error">
      <PageHeader title="没有备份" description="您在先前安装时没有创建备份，因此无法直接通过krissy重新安装，请尝试从steam补全游戏后重新使用krissy进行全新安装"/>
    </div>
  )
}