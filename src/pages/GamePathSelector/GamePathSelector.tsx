import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { useLocalGameInfo } from "../../hooks/useLocalGameInfo";
import { Task, useTask } from "../../hooks/useTask";

export default function GamePathSelector(){
  const [path, setPath] = useState("")
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { localGameInfo, updatePath, isLoading } = useLocalGameInfo()
  const { addTask } = useTask()

  useEffect(() => {
    updateNextFunc(() => {
      updatePath(path)
    })
  }, [path])

  useEffect(() => {
    if (isLoading == false){
      if (localGameInfo.isInvalidPath == false){
        addTask(Task.SetGamePath, {path: path})
        if (localGameInfo.hasInstalled == false){
          addTask(Task.SetAction, {action: 0})
          navToPage(2)
        } else {
          addTask(Task.SetAction, {action: 1})
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
        <input className="input" onInput={(e) => {setPath(e.currentTarget.value)}}/>
      </div>
    </div>
  )
}