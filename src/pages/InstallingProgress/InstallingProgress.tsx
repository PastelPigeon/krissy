import { useEffect, useRef } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { useInstall } from "../../hooks/useInstall";
import { usePage } from "../../hooks/usePage";

export default function InstallingProgress(){
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { install, logs, progress } = useInstall()
  const hasExtcutedRef = useRef(false)

  useEffect(() => {
    if (!hasExtcutedRef.current){
      install()
      hasExtcutedRef.current = true
    }

    updateNextFunc(null)
  }, [])

  useEffect(() => {
    if (progress == 14){
      navToPage(12)
    }
  }, [progress])

  return(
    <div className="installing-progress">
      <PageHeader title="正在安装" description="正在安装翻译包到您的DELTARUNE中，您可以通过下面的日志框获取安装进度"/>

      <div className="dialog">
        <textarea className="dialog-content" defaultValue={logs.join("\n")}/>
      </div>
    </div>
  )
}