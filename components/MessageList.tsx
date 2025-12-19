
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ExternalLink, Sprout, User } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="bg-green-100 p-6 rounded-full animate-pulse">
            <Sprout size={64} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Welcome to AgroMind AI</h2>
          <p className="text-stone-500 max-w-md mx-auto mt-2">
            Your real-time digital agronomist. Ask about market prices, crop health, or weather forecasts.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            {[
                "Current corn prices in Nebraska",
                "Why are my tomato leaves turning yellow?",
                "Pest control for organic wheat",
                "Best planting date for soybeans in Brazil"
            ].map((hint, i) => (
                <button 
                    key={i} 
                    className="p-3 text-sm text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all text-left"
                >
                    "{hint}"
                </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
            msg.role === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-green-600 text-white'
          }`}>
            {msg.role === 'user' ? <User size={20} /> : <Sprout size={20} />}
          </div>
          
          <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-stone-800 text-white rounded-tr-none' 
                : 'bg-white border border-stone-200 rounded-tl-none'
            }`}>
              {msg.image && (
                <img 
                  src={`data:image/jpeg;base64,${msg.image}`} 
                  alt="Uploaded crop" 
                  className="rounded-lg mb-3 max-w-full h-auto border border-stone-100" 
                />
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {msg.content}
              </div>
            </div>

            {msg.sources && msg.sources.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {msg.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 rounded-full text-xs text-stone-500 hover:text-green-600 hover:border-green-300 transition-all shadow-sm"
                  >
                    <ExternalLink size={12} />
                    <span className="truncate max-w-[150px]">{src.title}</span>
                  </a>
                ))}
              </div>
            )}
            
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-sm animate-pulse">
            <Sprout size={20} />
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
