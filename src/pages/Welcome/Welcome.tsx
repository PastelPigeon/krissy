import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";
import { usePage } from "../../hooks/usePage";

export default function Welcome(){
  const { updateNextFunc } = useNextButton()
  const { navToPage } = usePage()

  useEffect(() => {
    updateNextFunc(() => {
      navToPage(1)
    })
  }, [])

  return(
    <div className="welcome">
      <PageHeader title="欢迎安装DELTARUNE 好人汉化组 翻译包" description="[[再也受不了了]]DELTARUNE[[RAW？？？！]]文字？？再也不想应为读不懂[[鹰文]]而成为只会[SKIP]的[[4.99$]]小海绵？？？只需要[[点击按装]], 立即成为[[TEXT BLOCKED]]"/>
    </div>
  )
}