import { useEffect, useState } from "react";
import Pack from "../../components/Pack/Pack";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useOnlinePacksInfo } from "../../hooks/useOnlinePacksInfo";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";
import { Task, useTask } from "../../hooks/useTask";

export default function PacksSelector(){
  const { onlinePacksInfo } = useOnlinePacksInfo()
  const [selectedPacks, setSelectedPacks] = useState<number[]>([])

  const { navToPage } = usePage()
  const { updateNextFunc } = useNextButton()
  const { addTask } = useTask()

  useEffect(() => {
    updateNextFunc(() => {
      addTask(Task.SetPacks, {selectedPacks: selectedPacks})
      navToPage(9)
    })
  }, [])

  return(
    <div className="packs-selector">
      <PageHeader title="选择您需要安装的汉化包" description="请在下方选择您需要安装的翻译包，我们会在稍后为您进行安装"/>

      <div className="packs">
        {
          onlinePacksInfo?.availablePacks.map((pack) => {
            return(
              <div className="pack-wapper" data-selected={selectedPacks.includes(pack.chapterID)} onClick={() => {
                if (selectedPacks.includes(pack.chapterID)){
                  setSelectedPacks(selectedPacks.filter((selectedPack) => selectedPack != pack.chapterID))
                } else {
                  setSelectedPacks([...selectedPacks, pack.chapterID])
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