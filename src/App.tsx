import { GameInterface } from './components/GameInterface';
import { BandingInterface } from './banding/BandingInterface';
import { useModeStore } from './store/modeStore';

function App() {
  const { mode } = useModeStore();

  return (
    <>
      {mode === 'normal' ? <GameInterface /> : <BandingInterface />}
    </>
  )
}

export default App

