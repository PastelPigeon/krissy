import './App.css'
import BottomBar from './components/BottomBar/BottomBar'
import PageContainer from './components/PageContainer/PageContainer'
import SideImage from './components/SideImage/SideImage'
import { Window } from './components/Window/Window'
import { InstallationInfoProvider } from './hooks/useInstallationInfo'
import { LocalGameInfoProvider } from './hooks/useLocalGameInfo'
import { NextButtonProvider } from './hooks/useNextButton'
import { OnlinePacksInfoProvider } from './hooks/useOnlinePacksInfo'
import { PageProvider } from './hooks/usePage'

function App() {
  return (
    <div className='app'>
      <PageProvider>
        <InstallationInfoProvider>
          <NextButtonProvider>
            <LocalGameInfoProvider>
              <OnlinePacksInfoProvider>
                <Window title='krissy - 引导式DELTARUNE汉化安装与管理程序'>
                  <div className='app-content'>
                    <SideImage/>
                    <PageContainer/>
                    <BottomBar/>
                  </div>
                </Window>
            </OnlinePacksInfoProvider>
            </LocalGameInfoProvider>
          </NextButtonProvider>
        </InstallationInfoProvider>
      </PageProvider>
    </div>
  )
}

export default App
