import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ChatPage } from './pages/ChatPage'

function App() {
  return (
    <BrowserRouter basename='/voice-chatbot'>
      <Routes>
        <Route path='/' element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
