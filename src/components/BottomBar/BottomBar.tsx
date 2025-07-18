import { useNextButton } from "../../hooks/useNextButton"
import { usePage } from "../../hooks/usePage"
import { useRandomText } from "../../hooks/useRandomText"

export default function BottomBar(){
  const { pageIndex } = usePage()
  const { nextFunc } = useNextButton()
  const randomText = useRandomText()

  const endPageIndexes: number[] = [
    4,
    7,
    12,
    13,
    14,
    15
  ]

  return(
    <div className="bottom-bar">
      <div className="left">
        <label>:D COPYLEFT 2025 PROTOTYPE - {randomText}</label>
      </div>

      <div className="right">
        {
          nextFunc != null &&
          <button className="next-button" onClick={() => nextFunc != null && nextFunc()}>
            {endPageIndexes.includes(pageIndex) ? "完成" : "下一步"}
          </button>
        }
      </div>
    </div>
  )
}