import { useState } from "react";
import { useOnlinePacksInfo } from "./useOnlinePacksInfo";

function useOnlinePacksREADME(){
  const { onlinePacksInfo } = useOnlinePacksInfo()
  const [readme, setReadme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  const requestOnlinePacksREADME = async () => {
    setIsLoading(true)

    const response = await fetch(onlinePacksInfo?.readme!)

    if (response.ok){
      setReadme(await response.text())
      setHasError(false)
    } else {
      setReadme(null)
      setHasError(true)
    }

    setIsLoading(false)
  }

  return { readme, isLoading, hasError, requestOnlinePacksREADME }
}

export { useOnlinePacksREADME }