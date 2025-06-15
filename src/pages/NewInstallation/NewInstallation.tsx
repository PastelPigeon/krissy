import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { useOnlinePacksInfo } from "../../hooks/useOnlinePacksInfo";

export default function NewInstallation(){
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()

  useEffect(() => {
    updateNextFunc(() => {
      navToPage(5)
    })
  }, [])

  return(
    <div className="new-installation">
      <PageHeader title="执行全新安装" description="您离【【HYPERLINK BLOCKED】】【只差一步啊】，我们将会为您执行全新翻译包安装"/>
    </div>
  )
}