
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Send, Bot, User, Sparkles, XCircle } from 'lucide-react';
import { ColorTheme } from '../types';

interface ChatScreenProps {
  theme: ColorTheme;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ theme }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Bonjour. Je suis votre guide Zen. Posez-moi une question sur la respiration, la méditation ou partagez ce que vous ressentez."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref pour conserver l'instance du chat entre les rendus
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialisation de l'API
  useEffect(() => {
    const initChat = () => {
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) return;

            const ai = new GoogleGenAI({ apiKey });
            chatSessionRef.current = ai.chats.create({
                model: 'gemini-3-pro-preview',
                config: {
                    systemInstruction: "Tu es un Maître Zen sage, calme et bienveillant, expert en techniques de respiration (Pranayama, Cohérence Cardiaque, Buteyko) et en méditation. Tes réponses doivent être apaisantes, empathiques et concises (max 3-4 phrases). Tu aides l'utilisateur à réduire son stress. Tu parles français.",
                },
            });
        } catch (e) {
            console.error("Erreur init chat", e);
        }
    };
    initChat();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatSessionRef.current) throw new Error("Chat non initialisé (API Key manquante ?)");

        const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
        const responseText = result.text;

        const botMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: responseText || "Respire... Je n'ai pas pu formuler de réponse." 
        };
        setMessages(prev => [...prev, botMsg]);

    } catch (error) {
        console.error("Erreur chat:", error);
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'model', 
            text: "Une perturbation dans le flux... Vérifiez votre clé API ou votre connexion." 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 pb-4 px-4 relative">
      <header className="mb-4 px-2 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-yellow-300" size={24} />
            Chat Zen AI
            </h2>
            <p className="text-slate-400 text-sm mt-1">Sagesse instantanée avec Gemini 3.</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 mb-4">
        {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
                <div 
                    key={msg.id} 
                    className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                            ${isUser ? theme.bg : 'bg-slate-700'}
                        `}>
                            {isUser ? <User size={14} className="text-white" /> : <Bot size={16} className="text-sky-200" />}
                        </div>

                        {/* Bubble */}
                        <div className={`
                            p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                            ${isUser 
                                ? `${theme.bgTrans} border border-white/10 text-white rounded-tr-none` 
                                : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-none'
                            }
                        `}>
                            {msg.text}
                        </div>
                    </div>
                </div>
            );
        })}
        
        {/* Loading Indicator */}
        {isLoading && (
            <div className="flex w-full justify-start">
                 <div className="flex max-w-[85%] gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={16} className="text-sky-200" />
                    </div>
                    <div className="bg-slate-800/80 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative flex items-center gap-2">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question..."
            className={`
                w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full pl-5 pr-12 py-3.5 
                text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:${theme.ring} transition-all shadow-lg
            `}
        />
        <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
                absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                ${!input.trim() ? 'text-slate-600' : theme.text}
                hover:bg-white/10 transition-colors disabled:opacity-50
            `}
        >
            <Send size={20} />
        </button>
      </form>
    </div>
  );
};
