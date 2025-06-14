import './App.css'
import BottomBar from './components/BottomBar/BottomBar'
import PageContainer from './components/PageContainer/PageContainer'
import SideImage from './components/SideImage/SideImage'
import { Window } from './components/Window/Window'
import { LocalGameInfoProvider } from './hooks/useLocalGameInfo'
import { NextButtonProvider } from './hooks/useNextButton'
import { PageProvider } from './hooks/usePage'
import { TaskProvider } from './hooks/useTask'

function App() {
  return (
    <div className='app'>
      <PageProvider>
        <TaskProvider>
          <NextButtonProvider>
            <LocalGameInfoProvider>
              <Window title='krissy - 引导式DELTARUNE汉化安装与管理程序'>
                <div className='app-content'>
                  <SideImage/>
                  <PageContainer/>
                  <BottomBar/>
                </div>
              </Window>
            </LocalGameInfoProvider>
          </NextButtonProvider>
        </TaskProvider>
      </PageProvider>
    </div>
  )
}

export default App
