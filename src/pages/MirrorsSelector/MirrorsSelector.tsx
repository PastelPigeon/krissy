import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import usePing from "../../hooks/usePing";
import { usePage } from "../../hooks/usePage";
import { useNextButton } from "../../hooks/useNextButton";
import { InstallationInfoKey, useInstallationInfo } from "../../hooks/useInstallationInfo";

export default function MirrorsSelector(){
  const [mirrorID, setMirrorID] = useState(0)
  const [fastestMirrorID, setFastestMirrorID] = useState(999)

  const { getRTT, urlRTTs } = usePing()
  const { navToPage } = usePage()
  const { updateNextFunc } = useNextButton()
  const { updateInstallationInfo } = useInstallationInfo()

  const availableMirrors = [
    {
      id: 0,
      name: "Github（国外源）",
      url: import.meta.env.VITE_MIRROR_URL
    },
    {
      id: 1,
      name: "国内源（由Jank000.h提供）",
      url: import.meta.env.VITE_MIRROR_URL_CHINA
    }
  ]

  useEffect(() => {
    availableMirrors.map((availableMirror) => {
      getRTT(availableMirror.url)
    })

    updateNextFunc(() => {
      updateInstallationInfo(InstallationInfoKey.mirrorID, mirrorID)
      navToPage(5)
    })
  }, [mirrorID])

  useEffect(() => {
    const RTTS: number[] = urlRTTs.map((urlRTT) => {return Number(urlRTT.RTT.replace("ms", ""))}).filter((RTT) => {return RTT != 0})
    RTTS.sort()
    if (urlRTTs.filter((urlRTT) => {return Number(urlRTT.RTT.replace("ms", "")) == RTTS[0]})[0] != undefined){
      const fastestMirrorURL = urlRTTs.filter((urlRTT) => {return Number(urlRTT.RTT.replace("ms", "")) == RTTS[0]})[0].url
      const fastestMirrorIDTemp = availableMirrors.filter((availableMirror) => {return availableMirror.url == fastestMirrorURL})[0].id
      setFastestMirrorID(fastestMirrorIDTemp)
    }
  }, [urlRTTs])

  return(
    <div className="mirrors-selector">
      <PageHeader title="选择镜像源" description="您可以通过以下两个源下载翻译包文件，通常情况下，Github(国外源)拥有更快的更新速度，但在国内网络环境下下载速度并不理想，国内源拥有更快的下载速度，但需要从Github源同步，因此更新速度可能略慢于Github源，请根据您所在地的网络环境选择镜像源，或者通过下面的延迟选择(通常情况下，越小的延迟意味着更快的下载速度)"/>

      <div className="mirrors">
        {
          availableMirrors.map((availableMirror) => {
            return(
              <div className="mirror" data-selected={availableMirror.id == mirrorID} onClick={() => {
                if (availableMirror.id != mirrorID){
                  setMirrorID(availableMirror.id)
                }
              }}>
                <label className="name">{availableMirror.name}</label>
                <label className="RTT" data-fastest={fastestMirrorID == availableMirror.id}>延迟(RTT): 
                  {urlRTTs.filter((urlRTT) => urlRTT.url == availableMirror.url)[0] != undefined ? urlRTTs.filter((urlRTT) => urlRTT.url == availableMirror.url)[0].RTT : "正在测算"}
                  {fastestMirrorID == availableMirror.id && " 最快镜像！"}
                </label>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}