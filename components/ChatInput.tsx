
import React, { useState, useRef } from 'react';
import { Camera, Send, X, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, image?: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if ((text.trim() || imagePreview) && !disabled) {
      // Remove data:image/jpeg;base64, prefix for the API
      const base64Data = imagePreview ? imagePreview.split(',')[1] : undefined;
      onSend(text, base64Data);
      setText('');
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 bg-white border-t border-stone-200 sticky bottom-0 z-10 shadow-lg sm:rounded-t-2xl">
      {imagePreview && (
        <div className="relative inline-block mb-3">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-24 w-24 object-cover rounded-lg border-2 border-green-500 shadow-sm" 
          />
          <button 
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-stone-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
          title="Attach image of crop or pest"
        >
          <ImageIcon size={22} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about crops, prices, or weather..."
          className="flex-1 p-3 bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 border-none transition-all"
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !imagePreview)}
          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
            disabled || (!text.trim() && !imagePreview)
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-md active:scale-95'
          }`}
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
