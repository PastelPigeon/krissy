import { useEffect } from "react"
import { usePage } from "../../hooks/usePage"
import { useNextButton } from "../../hooks/useNextButton"
import PageHeader from "../../components/PageHeader/PageHeader"
import { useOnlinePacksInfo } from "../../hooks/useOnlinePacksInfo"
import { useInstallationInfo } from "../../hooks/useInstallationInfo"

export default function DownloadingPacksInfo(){
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { isLoading, hasError, requestOnlinePacksInfo  } = useOnlinePacksInfo()
  const { installationInfo } = useInstallationInfo()

  useEffect(() => {
    requestOnlinePacksInfo()
    updateNextFunc(null)
  }, [])

  useEffect(() => {
    if (isLoading == false){
      if (!hasError){
        navToPage(6)
      } else {
        navToPage(7)
      }
    }
  }, [isLoading])

  return(
    <div className="downloading-packs-info">
      <PageHeader title="正在下载在线包说明文件" description={`我们正在从${installationInfo.mirrorID == 0 ? import.meta.env.VITE_ONLINE_PACKS_INFO_SOURCE : import.meta.env.VITE_ONLINE_PACKS_INFO_SOURCE_CHINA}下载说明文件，请稍后`}/>
      <img src={new URL("../../assets/utils/loading.gif", import.meta.url).href} className="loading"/>
    </div>
  )
}