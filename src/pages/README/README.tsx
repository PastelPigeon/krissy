import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { useOnlinePacksREADME } from "../../hooks/useOnlinePacksREADME";

export default function README(){
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()
  const { readme, requestOnlinePacksREADME } = useOnlinePacksREADME()

  useEffect(() => {
    requestOnlinePacksREADME()

    updateNextFunc(() => {
      navToPage(8)
    })
  }, [])

  return(
    <div className="readme">
      <PageHeader title="翻译包使用说明" description="请阅读下面的翻译包使用说明，然后点击下一步，我们会为您继续安装"/>
      <div className="dialog">
        <label className="dialog-content">{readme}</label>
      </div>
    </div>
  )
}