import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import the chat component
const ChatWindow = dynamic(() => import('./ChatWindow'), {
  loading: () => <div className="animate-pulse">Loading chat...</div>,
  ssr: false
});

const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-8 right-8 z-50">
        {!isOpen && (
          <button
            onClick={() => setShowMenu(true)}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-blue-100"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <span className="font-medium text-gray-700 pr-2">Ask Jarvis</span>
          </button>
        )}

        {/* Menu Popup */}
        {showMenu && !isOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-80 bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <h3 className="text-lg font-semibold">Good Morning</h3>
              <p className="text-sm opacity-90">I'm Jarvis, your personal AI teaching assistant. How can I help you today?</p>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3"
                        onClick={() => setIsOpen(true)}>
                  <span className="text-xl">💬</span>
                  <span>Start Conversation</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1 block">🌍</span>
                    <span className="text-sm">Language Learning</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1 block">📚</span>
                    <span className="text-sm">Study Help</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1 block">🎯</span>
                    <span className="text-sm">Practice</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1 block">❓</span>
                    <span className="text-sm">FAQ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[400px] sm:max-w-2xl h-[600px] sm:h-[80vh] flex flex-col relative animate-slideUp sm:rounded-2xl shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">Jarvis AI</h3>
                  <p className="text-sm opacity-90">Your Learning Assistant</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowMenu(false);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Chat content */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for menu */}
      {showMenu && !isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default ChatBubble; 