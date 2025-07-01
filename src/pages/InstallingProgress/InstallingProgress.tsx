import { useEffect, useRef, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { useInstall } from "../../hooks/useInstall";
import { usePage } from "../../hooks/usePage";
import { useInstallationInfo } from "../../hooks/useInstallationInfo";

const tennaWords = [
  "孩子们，开始安装了",
  "正在下载文件，不要离开，家人们！",
  "哇，已经到解压部分了吗，我好激动啊，家人们！",
  "终极大奖马上就要来了！",
  "什么，Kris，你说我出现在这里是剧透！！？"
]

export default function InstallingProgress(){
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { install, logs, progress } = useInstall()
  const { installationInfo } = useInstallationInfo()

  const [currentTennaWordIndex, setCurrentTennaWordIndex] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasExtcutedRef = useRef(false)

  useEffect(() => {
    if (!hasExtcutedRef.current){
      install()
      hasExtcutedRef.current = true
    }

    updateNextFunc(null)
  }, [])

  useEffect(() => {
    switch (installationInfo.action){
      case "install":
        if (progress == 12){
          navToPage(12)
        }
        break
      case "reinstall":
        if (progress == 15){
          navToPage(12)
        }
        break
      case "uninstall":
        if (progress == 3){
          navToPage(15)
        }
        break
    }

    console.log(progress)
  }, [progress])

  useEffect(() => {
    textareaRef.current?.scrollTo({
      top: textareaRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [logs])

  useEffect(() => {
    const finalProgress = installationInfo.action == "install" ? progress : progress - 3
    console.log(finalProgress)

    switch (finalProgress){
      case 0:
        setCurrentTennaWordIndex(0)
        break
      case 2:
        setCurrentTennaWordIndex(1)
        break
      case 5:
        setCurrentTennaWordIndex(2)
        break
      case 9:
        setCurrentTennaWordIndex(3)
        break
    }
  }, [progress])

  return(
    <div className="installing-progress">
      <PageHeader title="正在安装" description="正在安装翻译包到您的DELTARUNE中，您可以通过下面的日志框获取安装进度"/>

      <div className="dialog">
        <textarea className="dialog-content" defaultValue={logs.join("\n")} ref={textareaRef}/>
      </div>

      <div className="tenna-hint">
        <div className="hint">
          <img className="background" src={new URL("/tenna_dialog.png", import.meta.url).href}/>
          <label className="text">{tennaWords[currentTennaWordIndex]}</label>
        </div>
        {/* 孩子们，我不是神人 */}
        <div className="tenna-container">
          <img src={new URL("/tenna_point_at_screen.png", import.meta.url).href} className="dancing-tenna"/>
          <label className="mystery">?</label>
        </div>
      </div>
    </div>
  )
}