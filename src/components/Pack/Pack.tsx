const chineseChapterNames = {
  "0": "DR主程序（选择章节）",
  "3": "第三章"
}

export default function Pack(props: {chapterID: number, packName: string, version: number, background: string}){
  return(
    <div className="pack">
      <img src={props.background} className="background"/>
      <div className="pack-content">
        <div className="left">
          <label className="pack-name">{props.packName}</label>
          <label className="chapter-id">{`适用于${chineseChapterNames[props.chapterID.toString() as keyof typeof chineseChapterNames]}`}</label>
        </div>

        <div className="right">
          <label className="version">{`版本 v${props.version.toString()}`}</label>
        </div>
      </div>
    </div>
  )
}