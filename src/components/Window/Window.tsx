import { getCurrentWindow } from "@tauri-apps/api/window";
import type { ReactNode } from "react";

const appWindow = getCurrentWindow();

export function Window(props: {children: ReactNode, title: string}){
  return(
    <div className="window">
      <div className="title-bar" data-tauri-drag-region>
        <label className="title">{props.title}</label>

        <div className="right">
          <button className="close-button" onClick={() => appWindow.close()}/>
        </div>
      </div>

      <div className="content">
        {props.children}
      </div>
    </div>
  )
}