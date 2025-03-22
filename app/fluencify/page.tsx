'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ChatBubble component
const ChatBubble = dynamic(() => import('../components/ChatBubble'), {
  ssr: false
});

const Fluencify: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Welcome to Fluencify
        </h1>
        
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Your personal language learning platform powered by AI. Start a conversation with Jarvis,
          your multilingual teaching assistant, to begin your learning journey! 🚀
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {/* Feature cards */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Multiple Languages</h3>
            <p className="text-gray-600">Learn and practice in any language with our AI assistant</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Interactive Learning</h3>
            <p className="text-gray-600">Engage in natural conversations and get instant feedback</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Personalized Teaching</h3>
            <p className="text-gray-600">Get customized lessons and explanations tailored to you</p>
          </div>
        </div>
      </div>

      {/* Chat bubble */}
      <ChatBubble />
    </main>
  );
};

export default Fluencify; 