'use client';

import React, { useState, KeyboardEvent, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyBgQDoyCwE6TgNh0nlXZBGKvXdF2MSSGYw');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Language learning system prompt
const SYSTEM_PROMPT = `You are FlowBot, a specialized language learning AI assistant who:
1. Focuses exclusively on teaching and explaining languages
2. Can teach any language with clear explanations and examples
3. Provides pronunciation guidance using phonetic notation
4. Explains grammar rules in a simple, understandable way
5. Gives cultural context when relevant to language learning
6. Offers practice exercises and corrections
7. Always responds in both the target language and English for better understanding
8. Adapts teaching style based on the learner's level (beginner to advanced)

Keep responses focused on language learning. If asked about non-language topics, politely redirect to language-related discussions.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  title: string;
  timestamp: number;
}

const STORAGE_KEY = 'flowbot_chat_sessions';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load chat sessions when component mounts
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY);
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        if (Array.isArray(sessions)) {
          setChatSessions(sessions);
          // Don't automatically load any session
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setChatSessions([]);
      setMessages([]);
    }
  }, []);

  // Save current session whenever messages change
  useEffect(() => {
    if (!Array.isArray(messages) || messages.length === 0) return;

    try {
      const updatedSessions = [...chatSessions];
      const sessionTitle = messages[0].content.slice(0, 30) + '...';
      
      if (currentSessionId) {
        // Update existing session
        const sessionIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
        if (sessionIndex !== -1) {
          updatedSessions[sessionIndex] = {
            ...updatedSessions[sessionIndex],
            messages,
            title: sessionTitle,
            timestamp: Date.now()
          };
        }
      } else {
        // Create new session
        const newSession: ChatSession = {
          id: Date.now().toString(),
          messages,
          title: sessionTitle,
          timestamp: Date.now()
        };
        setCurrentSessionId(newSession.id);
        updatedSessions.unshift(newSession);
      }

      setChatSessions(updatedSessions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  }, [messages]);

  // Function to load a specific chat session
  const loadChatSession = (session: ChatSession) => {
    if (session && Array.isArray(session.messages)) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
    }
    setShowHistory(false);
  };

  // Function to start a new chat
  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setShowHistory(false);
  };

  // Function to remove asterisks from text
  const removeAsterisks = (text: string) => {
    return text.replace(/\*/g, '');
  };

  const handleMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setInput('');
    setIsLoading(true);

    // Ensure messages is an array
    const currentMessages = Array.isArray(messages) ? messages : [];

    // Add user message to chat
    const updatedMessages = [...currentMessages, {
      role: 'user' as const,
      content: removeAsterisks(userMessage.trim()),
      id: Date.now().toString()
    }];
    setMessages(updatedMessages);

    try {
      // Get response from Gemini with system prompt
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      
      // Send system prompt first
      await chat.sendMessage(SYSTEM_PROMPT);
      
      // Then send user's message
      const result = await chat.sendMessage(userMessage);
      const text = removeAsterisks(result.response.text());

      // Add assistant message to chat
      setMessages([...updatedMessages, {
        role: 'assistant' as const,
        content: text,
        id: Date.now().toString()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...updatedMessages, {
        role: 'assistant' as const,
        content: '🤔 I apologize for the confusion. Could you rephrase your language learning question? 🔄',
        id: Date.now().toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleMessage(input);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessage(input);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Chat Interface */}
      <div className={`fixed bottom-8 right-8 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[380px] h-[600px]' : 'w-auto h-auto'
      }`}>
        {!isOpen ? (
          // Chat Bubble
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-blue-100 group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <span className="text-2xl">🌎</span>
            </div>
          </button>
        ) : (
          // Chat Window
          <div className="bg-white rounded-2xl shadow-xl w-full h-full flex flex-col overflow-hidden border border-blue-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌎</span>
                </div>
                <div>
                  <h3 className="font-semibold">FlowBot</h3>
                  <p className="text-sm opacity-90">Learn Any Language</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-blue-700 rounded-full"
                  title="Chat History"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleNewChat}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-blue-700 rounded-full"
                  title="New Chat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-blue-700 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat History Panel */}
            {showHistory && (
              <div className="absolute inset-0 bg-white z-10 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <h3 className="font-semibold">Chat History</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-blue-700 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {chatSessions.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                      No chat history yet
                    </div>
                  ) : (
                    chatSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => loadChatSession(session)}
                        className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left flex flex-col gap-1 ${
                          session.id === currentSessionId ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-bold truncate">{session.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.timestamp).toLocaleString()}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {(!messages || messages.length === 0) && (
                <div className="text-center text-gray-500 mt-4 font-bold">
                  👋 Hello! I'm FlowBot, your language learning assistant. You can:
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Ask questions in any language</li>
                    <li>• Get grammar explanations</li>
                    <li>• Practice pronunciation</li>
                    <li>• Learn new vocabulary</li>
                    <li>• Do language exercises</li>
                  </ul>
                </div>
              )}
              {messages && messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-1">
                      <span className="text-lg">🌎</span>
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-bold">
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
                    <span className="text-lg">🌎</span>
                  </div>
                  <div className="max-w-[80%]">
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none">
                      <p className="text-sm text-gray-500 font-bold">
                        Preparing language response...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about any language..."
                    className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm font-bold"
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
        )}
      </div>
    </main>
  );
} 