import { useEffect, useState } from "react";
import Pack from "../../components/Pack/Pack";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useOnlinePacksInfo } from "../../hooks/useOnlinePacksInfo";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { InstallationInfoKey, useInstallationInfo } from "../../hooks/useInstallationInfo";

export default function PacksSelector(){
  const { onlinePacksInfo } = useOnlinePacksInfo()
  const [selectedPacks, setSelectedPacks] = useState<number[]>([])

  const { navToPage } = usePage()
  const { updateNextFunc } = useNextButton()
  const { updateInstallationInfo } = useInstallationInfo()

  useEffect(() => {
    updateNextFunc(() => {
      updateInstallationInfo(InstallationInfoKey.selectedPacks, selectedPacks)
      navToPage(9)
    })
  }, [selectedPacks])

  return(
    <div className="packs-selector">
      <PageHeader title="选择您需要安装的汉化包" description="请在下方选择您需要安装的翻译包，我们会在稍后为您进行安装"/>

      <div className="packs">
        {
          onlinePacksInfo?.availablePacks.map((pack) => {
            return(
              <div className="pack-wapper" data-selected={selectedPacks.includes(pack.chapterID)} onClick={() => {
                if (selectedPacks.includes(pack.chapterID)){
                  setSelectedPacks(prev => (prev.filter((selectedPack) => selectedPack != pack.chapterID)))
                } else {
                  setSelectedPacks(prev => ([
                    ...prev,
                    pack.chapterID
                  ]))
                }
              }}>
                <Pack chapterID={pack.chapterID} packName={pack.packName} version={pack.version} background={pack.background}/>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}