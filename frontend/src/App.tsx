import './App.css'
import InputGroup from './components/Input/InputGroup'
import Words from './components/Input/wordles.json'

function App() {
  const SelectedWord = Words[Math.floor(Math.random() * Words.length)].toUpperCase();

  return (
    <div className='flex justify-center items-center h-screen'>
      <InputGroup SelectedWord={SelectedWord} />
    </div>
  )
}

export default App
