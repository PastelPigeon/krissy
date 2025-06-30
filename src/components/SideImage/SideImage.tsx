import { usePage } from "../../hooks/usePage"

const sideImages: string[] = [
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif",
  "/side-images/page-normal.gif"
]

export default function SideImage(){
  const { pageIndex } = usePage()

  return(
    <img src={new URL(sideImages[pageIndex], import.meta.url).href} className="side-image"/>
  )
}