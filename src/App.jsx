import { useState } from 'react'
import './App.css'
import Fifo from './components/Fifo'
import RoundRobin from './components/RoundRobin'
import Execute from './components/Execute'
import Process from './components/Process'

function App() {
  const [currentScreen, setCurrentScreen] = useState(0)

  return (
    <>
      {currentScreen === 0 && (
        <div className='buttons-container'>
          <button onClick={() => setCurrentScreen(1)}>FIFO Linux</button>
          <button onClick={() => setCurrentScreen(2)}>Round Robin Linux</button>
          <button onClick={() => setCurrentScreen(3)}>Ejecutar</button>
          <button onClick={() => setCurrentScreen(4)}>Proceso</button>
        </div>
      )}

      {currentScreen === 1 && <Fifo onBack={() => setCurrentScreen(0)} />}
      {currentScreen === 2 && <RoundRobin onBack={() => setCurrentScreen(0)} />}
      {currentScreen === 3 && <Execute onBack={() => setCurrentScreen(0)} />}
      {currentScreen === 4 && <Process onBack={() => setCurrentScreen(0)} />}
    </>
  )
}

export default App
