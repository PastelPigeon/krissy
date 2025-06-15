import { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useNextButton } from "../../hooks/useNextButton";

export default function InstallingProgress(){
  const { updateNextFunc } = useNextButton()

  useEffect(() => {
    updateNextFunc(null)
  }, [])

  return(
    <div className="installing-progress">
      <PageHeader title="正在安装" description="正在安装翻译包到您的DELTARUNE中，您可以通过下面的日志框获取安装进度"/>

      <div className="dialog">
        <textarea className="dialog-content"/>
      </div>

      <img className="loading" src={new URL("../../assets/utils/loading.gif", import.meta.url).href}/>
    </div>
  )
}