import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function DownloadingPacksInfoError(){
  const { updateNextFunc } = useNextButton()

  useEffect(() => {
    updateNextFunc(() => {
      appWindow.close()
    })
  }, [])

  return(
    <div className="invalid-game-path">
      <PageHeader title="下载出现错误" description={`一个意外的错误使您无法下载包描述文件，请点击下方的按钮关闭安装器，然后稍后重启安装器进行再次尝试`}/>
    </div>
  )
}