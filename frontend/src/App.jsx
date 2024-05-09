// App.jsx
import React, { useState } from 'react'
import Chat from './Chat'

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <button onClick={handleChatToggle} className='fixed bottom-0 right-0 m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Chat
      </button>
      <Chat isOpen={isChatOpen} onClose={handleChatToggle} />
    </div>
  )
}

export default App
