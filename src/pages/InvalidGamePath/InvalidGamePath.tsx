import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useLocalGameInfo } from "../../hooks/useLocalGameInfo";
import { useNextButton } from "../../hooks/useNextButton";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function InvalidGamePath(){
  const { path } = useLocalGameInfo()

  const { updateNextFunc } = useNextButton()

  useEffect(() => {
    updateNextFunc(() => {
      appWindow.close()
    })
  }, [])

  return(
    <div className="invalid-game-path">
      <PageHeader title="错误的游戏路径" description={`您刚才指定了一个错误的游戏路径${path}, 我们在该路径下未找到DELTARUNE.EXE, 请再次检查您的路径输入受否正确，然后点击确定关闭安装程序并重启`}/>
    </div>
  )
}