import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { FaEdit, FaTrash } from 'react-icons/fa';

const socket = io('/');

const Chat = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/chats/663c414b51302116269e40ab/message/662ed6a4cb0367413933dedf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        socket.emit('message', message);
        console.log('Mensaje enviado con éxito:', data);
        setMessage('');
  
        // Actualiza el estado de los mensajes agregando el nuevo mensaje al final del array
        setMessages(prevMessages => [...prevMessages, data]);
  
        // Llama a la función para cargar los mensajes nuevamente
        recibeMessages();
      } else {
        console.log('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };
  


  const recibeMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/chats/663c414b51302116269e40ab/message', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
        console.log('Mensajes recibidos exitosamente:', data);
      } else {
        console.log('Error al recibir los mensajes');
      }
    } catch (error) {
      console.error('Error al recibir los mensajes:', error);
    }
  };

  useEffect(() => {
    recibeMessages();

    socket.on('message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
      scrollToBottom();
      recibeMessages();
    });

    return () => {
      socket.off('message');
    };
  }, []);


  const handleEditMessage = async (id) => {
  };

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/chats/663c414b51302116269e40ab/message/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Mensaje eliminado con éxito');
        recibeMessages();
      } else {
        console.log('Error al eliminar el mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error);
    }
  };


  return (
    <div className={`fixed bottom-0 right-0 bg-zinc-800 text-white ${isOpen ? 'block' : 'hidden'}`}>
      <button onClick={onClose} className='absolute top-0 right-0 m-2'>Cerrar Chat</button>
      <div className='p-10 flex flex-col'>
        <h1 className='text-2xl font-bold my-2'>Chat</h1>

        <ul className="messages-list overflow-y-auto max-h-96 flex-1">
          {messages.map((message) => (
            <li key={message._id} className={`my-2 p-2 table rounded-md ${message._id === 'Yo' ? 'bg-sky-700' : 'bg-black ml-auto'}`}>
              <span className='text-xs text-slate-300 block'>{message.message}</span>
              <span className='text-xs text-slate-300 block'>{new Date(message.createdAt).toLocaleString()}</span> {/* Formatea la fecha aquí */}
              <span className='text-md message-body'>{message.body}</span>
              <div className='flex'>
                <button onClick={() => handleEditMessage(message._id)} className='text-blue-500 mr-2'><FaEdit /></button>
                <button onClick={() => handleDeleteMessage(message._id)} className='text-red-500'><FaTrash /></button>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <div className='flex items-center'>
          <input type="text" placeholder='Escribir mensaje'
            value={message} onChange={(e) => setMessage(e.target.value)} className='border-2 border-zinc-500 p-2 flex-1 text-black mr-2' />
          <button type='submit' onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
