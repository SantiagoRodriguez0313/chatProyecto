// Chat.jsx
import './App.css'; // Importa el archivo de estilos
import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importa los íconos de editar y eliminar

const socket = io('/') // http://localhost:4000

const Chat = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const response = await fetch('https://itacaapi2-0-1oon.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    })
    if (response.ok) {
      const data = await response.json()
      
    }
    else{
      console.log('Error al enviar el mensaje')
    }
  };

  useEffect(() => {
    socket.on('message', receiveMessage);
    scrollToBottom();

    return () => {
      socket.off('message', receiveMessage);
    };
  }, [messages]);

  const receiveMessage = (message) => {
    setMessages(state => [...state, message])
    scrollToBottom();
  }

  const handleEditMessage = (id) => {
    // Implementa la lógica para editar un mensaje con el id proporcionado
  }

  const handleDeleteMessage = (id) => {
    // Implementa la lógica para eliminar un mensaje con el id proporcionado
  }

  return (
    <div className={`fixed bottom-0 right-0 bg-zinc-800 text-white ${isOpen ? 'block' : 'hidden'}`}>
      <button onClick={onClose} className='absolute top-0 right-0 m-2'>Cerrar Chat</button>
      <div className='p-10 flex flex-col'>
        <h1 className='text-2xl font-bold my-2'>Chat</h1>

        <ul className="messages-list overflow-y-auto max-h-96 flex-1">
          {
            messages.map((message, i) => (
              <li key={message.id} className={`my-2 p-2 table  rounded-md ${message.from === 'Yo' ? 'bg-sky-700' : 'bg-black ml-auto'}`}>
                <span className='text-xs text-slate-300 block'>{message.from}</span>
                <span className='text-xs text-slate-300 block'>{message.time}</span> {/* Muestra la hora del mensaje */}
                <span className='text-md message-body'>{message.body}</span>
                <div className='flex'>
                  <button onClick={() => handleEditMessage(message.id)} className='text-blue-500 mr-2'><FaEdit /></button>
                  <button onClick={() => handleDeleteMessage(message.id)} className='text-red-500'><FaTrash /></button>
                </div>
              </li>
            ))
          }
          <div ref={messagesEndRef} />
        </ul>

        <div className='flex items-center'>
          <input type="text" placeholder='Escribir mensaje'
            value={message} onChange={(e) => setMessage(e.target.value)} className='border-2 border border-zinc-500 p-2 flex-1 text-black mr-2' />
          <button type='submit' onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
