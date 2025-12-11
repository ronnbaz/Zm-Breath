import React, { useState } from 'react';
import { getZenWisdom } from '../services/zenService';
import { Sparkles, X, Send } from 'lucide-react';

export const ZenWisdom: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feeling, setFeeling] = useState('');
  const [wisdom, setWisdom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling.trim()) return;

    setIsLoading(true);
    setWisdom(null);
    
    const result = await getZenWisdom(feeling);
    
    setWisdom(result);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setWisdom(null);
    setFeeling('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur transition-all border border-white/10 shadow-lg group"
      >
        <Sparkles size={18} className="text-yellow-300 group-hover:rotate-12 transition-transform" />
        <span className="font-medium text-sm">Zen AI</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-8 right-8 sm:right-8 sm:w-80 w-[calc(100%-40px)] z-30">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles size={18} className="text-yellow-300" />
          Maître Zen
        </h3>
        
        {!wisdom ? (
          <form onSubmit={handleAsk} className="flex flex-col gap-3">
            <p className="text-sm text-slate-300">Comment vous sentez-vous maintenant ?</p>
            <div className="relative">
              <input 
                type="text" 
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="Ex: Stressé, fatigué..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={isLoading || !feeling.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-300 disabled:opacity-50"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Send size={16} />}
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <blockquote className="text-sky-100 italic text-lg leading-relaxed border-l-2 border-sky-400 pl-4 my-2 font-light">
              "{wisdom}"
            </blockquote>
            <button 
              onClick={() => setWisdom(null)}
              className="text-xs text-slate-400 hover:text-white mt-4 underline decoration-slate-600 hover:decoration-white underline-offset-2"
            >
              Demander autre chose
            </button>
          </div>
        )}
      </div>
    </div>
  );
};