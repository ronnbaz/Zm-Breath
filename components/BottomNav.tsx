
import React from 'react';
import { Timer, BookOpen, Settings, History, MessageCircle } from 'lucide-react';
import { ColorTheme } from '../types';

interface BottomNavProps {
  activeView?: 'LIST' | 'SETUP' | 'PRACTICE' | 'SETTINGS' | 'GUIDE' | 'HISTORY' | 'CHAT';
  onViewChange?: (view: 'LIST' | 'SETTINGS' | 'GUIDE' | 'HISTORY' | 'CHAT') => void;
  theme: ColorTheme;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView = 'LIST', onViewChange, theme }) => {
  
  const getButtonClass = (viewName: string) => `
    flex flex-col items-center gap-1 transition-all duration-300 px-2 py-2 rounded-lg
    ${activeView === viewName ? `${theme.text} bg-white/5` : 'text-slate-400 hover:text-slate-200'}
  `;

  // Note: Le nom du fichier est resté BottomNav pour ne pas briser les imports, 
  // mais c'est fonctionnellement une TopNav maintenant.
  return (
    <div className="sticky top-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 py-2 z-40 shadow-lg">
      <button 
        className={getButtonClass('LIST')}
        onClick={() => onViewChange?.('LIST')}
      >
        <Timer size={20} strokeWidth={activeView === 'LIST' ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-wide uppercase">Exercices</span>
      </button>
      
      <button 
        className={getButtonClass('GUIDE')}
        onClick={() => onViewChange?.('GUIDE')}
      >
        <BookOpen size={20} strokeWidth={activeView === 'GUIDE' ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-wide uppercase">Guide</span>
      </button>

      <button 
        className={getButtonClass('CHAT')}
        onClick={() => onViewChange?.('CHAT')}
      >
        <MessageCircle size={20} strokeWidth={activeView === 'CHAT' ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-wide uppercase">Chat</span>
      </button>

      <button 
        className={getButtonClass('HISTORY')}
        onClick={() => onViewChange?.('HISTORY')}
      >
        <History size={20} strokeWidth={activeView === 'HISTORY' ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-wide uppercase">Historique</span>
      </button>
      
      <button 
        className={getButtonClass('SETTINGS')}
        onClick={() => onViewChange?.('SETTINGS')}
      >
        <Settings size={20} strokeWidth={activeView === 'SETTINGS' ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-wide uppercase">Options</span>
      </button>
    </div>
  );
};
