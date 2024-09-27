'use client'

import { useState } from 'react'
import { FaComments, FaTimes } from 'react-icons/fa'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const toggleChat = () => setIsOpen(!isOpen)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }])
      // Here you would typically send the message to your AI backend
      // and get a response. For now, we'll just echo the message.
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `You said: ${input}`, sender: 'bot' }])
      }, 1000)
      setInput('')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">SustainAI Chatbot</h3>
            <button onClick={toggleChat} className="text-white hover:text-green-200">
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-2 max-w-[70%] ${message.sender === 'user' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600">
                <FaComments />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors duration-300"
        >
          <FaComments size={24} />
        </button>
      )}
    </div>
  )
}