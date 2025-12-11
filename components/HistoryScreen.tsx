
import React from 'react';
import { SessionData, ColorTheme, MODES } from '../types';
import { Clock, Calendar, Wind, Activity } from 'lucide-react';

interface HistoryScreenProps {
  history: SessionData[];
  theme: ColorTheme;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, theme }) => {
  
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-4 pt-4 px-4 custom-scrollbar">
      <header className="mb-6 px-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Historique</h2>
        <p className="text-slate-400 text-sm mt-1">Vos moments de sérénité.</p>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-60">
          <Activity size={48} className="mb-4" />
          <p>Aucune séance enregistrée pour le moment.</p>
          <p className="text-xs mt-2">Pratiquez au moins 30 secondes pour sauvegarder.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {history.map((session) => (
            <div 
              key={session.id} 
              className="bg-slate-800/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-semibold text-lg text-slate-100`}>
                  {MODES[session.mode]?.label.split('(')[0] || 'Session'}
                </h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-700/50 text-slate-300`}>
                  {formatDate(session.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Clock size={14} />
                  <span>{formatDuration(session.durationSeconds)}</span>
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Wind size={14} />
                  <span>{session.cyclesCompleted} cycles</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
