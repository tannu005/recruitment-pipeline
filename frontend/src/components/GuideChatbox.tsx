import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { WiseBerryAvatar } from './animations/AIGuide';
import { Send, X, User } from 'lucide-react';

interface GuideChatboxProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const GuideChatbox: React.FC<GuideChatboxProps> = ({ isOpen, onClose, apiUrl }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hi! I'm your AI guide. How can I help you navigate the platform today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${apiUrl}/guide/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await response.json();
      
      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply || "I didn't quite understand that." };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error communicating with AI Guide:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, my connection was lost. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-28 right-6 w-80 sm:w-96 bg-[#1A1025]/80 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl shadow-[0_8px_32px_rgba(217,70,239,0.2)] overflow-hidden z-[100] flex flex-col max-h-[500px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0F0914]/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[10, 10, 10]} intensity={1.5} color="#e0e7ff" />
                  <WiseBerryAvatar hovered={false} isChatOpen={true} mini={true} />
                </Canvas>
              </div>
              <h3 className="font-semibold text-white">Berrywise AI</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px]">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1 border border-indigo-500/20">
                    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                      <ambientLight intensity={0.8} />
                      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#e0e7ff" />
                      <WiseBerryAvatar hovered={false} isChatOpen={true} mini={true} />
                    </Canvas>
                  </div>
                )}
                
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[14px] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 justify-start"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} color="#e0e7ff" />
                    <WiseBerryAvatar hovered={false} isChatOpen={true} mini={true} />
                  </Canvas>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#0F0914]/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-1 p-1.5 rounded-full text-fuchsia-400 hover:bg-fuchsia-500/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
