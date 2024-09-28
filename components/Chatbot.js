'use client';

import { useState, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleBotReply("Welcome to EcoEarn! How can I assist you today?");
    }
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleBotReply = async (userMessage) => {
    // Add the user message to the state before making the request
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage, 
          chatHistory: messages.map(m => ({ role: m.sender, content: m.text }))
        }),
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble responding right now.", sender: 'bot' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleBotReply(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">EcoEarn Assistant</h3>
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
                <FaPaperPlane />
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
  );
}
