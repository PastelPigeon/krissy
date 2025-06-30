import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function UninstallWithoutBackupError(){
  const { updateNextFunc } = useNextButton()

  useEffect(() => {
    updateNextFunc(() => {
      appWindow.close()
    })
  }, [])

  return(
    <div className="reinstall-without-backup-error">
      <PageHeader title="没有备份" description="您在先前安装时没有创建备份，因此无法直接通过krissy重新卸载翻译包，请尝试从steam补全游戏来完全卸载"/>
    </div>
  )
}