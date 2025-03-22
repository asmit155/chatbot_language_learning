'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyBgQDoyCwE6TgNh0nlXZBGKvXdF2MSSGYw');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with system prompt
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const systemPrompt = `You are Jarvis, a friendly and knowledgeable AI assistant who:
        1. Can communicate in multiple languages
        2. Has a helpful and patient teaching style
        3. Can explain complex topics in simple terms
        4. Is always polite and professional
        5. Can help with learning various subjects
        6. Responds in the same language as the user's input
        7. Can provide examples and practice exercises when appropriate
        8. Provides clear, direct answers without using asterisks or special formatting
        9. Uses emojis occasionally to make responses more engaging
        10. Makes learning fun and interactive
        
        Your responses should be engaging, playful, and educational, with a friendly personality.`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        setMessages([{ 
          role: 'assistant', 
          content: '👋 Hi there! I\'m Jarvis, your friendly AI teaching buddy! How can I make learning fun for you today? 🌟', 
          id: 'welcome'
        }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      id: Date.now().toString()
    }]);

    try {
      // Get response from Gemini
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text().replace(/\*\*/g, ''); // Remove asterisks from response

      // Add assistant message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: text,
        id: Date.now().toString()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '🤔 Oops! I hit a small bump there. Could you try asking that again? 🔄',
        id: Date.now().toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-1">
                <span className="text-lg">🤖</span>
              </div>
            )}
            <div
              className={`max-w-[80%] ${
                message.role === 'user' ? 'order-1' : 'order-2'
              }`}
            >
              <div
                className={`p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2 mt-1 order-2">
                <span className="text-sm">👤</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-lg">🤖</span>
            </div>
            <div className="max-w-[80%]">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none">
                <p className="text-sm text-gray-500">
                  Thinking...
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 