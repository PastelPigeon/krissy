import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function InstallingCompleted(){
  const { updateNextFunc } = useNextButton()
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  setTimeout(() => {
    setIsVideoPlaying(false)
  }, 5000)

  useEffect(() => {
    updateNextFunc(() => {
      appWindow.close()
    })
  }, [])

  return(
    <div className="installing-completed">
      {
        isVideoPlaying &&
        <video src={new URL("/its-tv-time.mp4", import.meta.url).href} autoPlay className="shenren-video"/>
      }
      <PageHeader title="安装完成" description="It's DELTARUNE time! 您的安装已完成，现在启动DELTARUNE即可使用中文版汉化，希望您有一段美好的游戏时光！"/>
    </div>
  )
}