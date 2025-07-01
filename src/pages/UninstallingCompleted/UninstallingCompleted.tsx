import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";

const appWindow = getCurrentWindow();

export default function UninstallingCompleted(){
  const { updateNextFunc } = useNextButton()

  useEffect(() => {
    updateNextFunc(() => {
      appWindow.close()
    })
  }, [])

  return(
    <div className="uninstalling-completed">
      <PageHeader title="卸载完成" description="汉化包已从您的DELTARUNE中卸载，您可以稍后手动删除krissy，希望您有一段美好的游戏时光！"/>
    </div>
  )
}