
import React, { useState, useCallback } from 'react';
import { Sprout, Menu, Leaf, LayoutDashboard, History, Settings, Info } from 'lucide-react';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import { Message } from './types';
import { chatWithAgroMind } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSendMessage = useCallback(async (content: string, image?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || (image ? "I've uploaded an image for analysis." : ""),
      timestamp: new Date(),
      image,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatWithAgroMind(content, image, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while searching for data. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-stone-50 font-sans overflow-hidden">
      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 w-72 bg-white border-r border-stone-200 z-40 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-100 flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-xl text-white">
              <Sprout size={24} />
            </div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">AgroMind AI</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button className="flex items-center gap-3 w-full p-3 text-stone-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
              <LayoutDashboard size={20} />
              <span className="font-medium">Market Overview</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 text-green-700 bg-green-50 rounded-xl transition-all font-semibold">
              <Leaf size={20} />
              <span>Agronomy Chat</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 text-stone-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
              <History size={20} />
              <span>Soil Reports</span>
            </button>
          </nav>

          <div className="p-4 border-t border-stone-100 space-y-2">
            <button className="flex items-center gap-3 w-full p-3 text-stone-500 hover:text-stone-800 transition-colors text-sm">
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
            <button className="flex items-center gap-3 w-full p-3 text-stone-500 hover:text-stone-800 transition-colors text-sm">
              <Info size={18} />
              <span>AgroMind Guide</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-stone-50">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-stone-200 sticky top-0 z-20">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">REAL-TIME DATA</span>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-stone-500 font-medium">AgroMind v3.5-flash</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-stone-800">Spring Ridge Farm</p>
              <p className="text-[10px] text-stone-500">Premium Farmer</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden ring-2 ring-white">
                <img src="https://picsum.photos/seed/farmer/200/200" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />
          
          {/* Action Footer */}
          <div className="max-w-4xl mx-auto w-full px-4 mb-4">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
