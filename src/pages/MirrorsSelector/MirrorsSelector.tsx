import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useInstallationInfo, InstallationInfoKey } from "../../hooks/useInstallationInfo";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import usePing from "../../hooks/usePing";

export default function MirrorsSelector(){
  const availableMirrors = ["github.com", "gh.llkk.cc", "github.dpik.top"]

  const [mirror, setMirror] = useState("github.com")

  const { navToPage } = usePage()
  const { updateNextFunc } = useNextButton()
  const { updateInstallationInfo } = useInstallationInfo()
  const { getRTT, urlRTTs } = usePing()

  useEffect(() => {
    updateNextFunc(() => {
      updateInstallationInfo(InstallationInfoKey.mirror, mirror)
      navToPage(11)
    })

    availableMirrors.forEach((availableMirror) => {
      getRTT(availableMirror)
    })
  }, [mirror])

  return(
    <div className="mirrors-selector">
      <PageHeader title="选择一个包镜像" description="您可以在下面的列表中选择一个包的镜像。为什么选择镜像？krissy官方下载源来源于github，国内可能无法正常访问，您可以通过选择镜像源替代官方源来加速下载，但请注意，镜像源有时并不稳定，且下载内容有被篡改的风险，可能危害您的电脑，请谨慎使用"/>

      <div className="mirrors">
        {availableMirrors.map((availableMirror) => {
          return(
            <div className="mirror" onClick={() => {setMirror(availableMirror)}} data-selected={mirror == availableMirror}>
              <label className="url">{availableMirror}</label>
              <label className="RTT">RTT(延迟) {urlRTTs.filter((urlRTT) => urlRTT.url == availableMirror)[0] != undefined ? urlRTTs.filter((urlRTT) => urlRTT.url == availableMirror)[0].RTT : "正在测算"}</label>
            </div>
          )
        })}
      </div>
    </div>
  )
}