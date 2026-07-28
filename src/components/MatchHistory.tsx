import { History, Trash2 } from 'lucide-react';
import { Team, TournamentMatch } from '../types';

interface MatchHistoryProps {
  tournamentHistory: TournamentMatch[];
  teams: Team[];
  onShowClearConfirm: () => void;
}

export function MatchHistory({
  tournamentHistory,
  teams,
  onShowClearConfirm,
}: MatchHistoryProps) {
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-white mb-2">Histórico de Partidas</h3>
          <p className="text-zinc-500">Registros de jogos anteriores e resultados</p>
        </div>
        {tournamentHistory.length > 0 && (
          <button
            onClick={onShowClearConfirm}
            className="px-6 py-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2"
          >
            <Trash2 size={16} /> Limpar Tudo
          </button>
        )}
      </header>

      {tournamentHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-800/20 rounded-[3rem] border border-white/5 space-y-4">
          <History size={64} className="text-zinc-700" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest">
            Nenhuma partida registrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournamentHistory
            .slice()
            .reverse()
            .map((hist, i) => {
              const t1 = teams.find((t) => t.id === hist.team1.id) || {
                color: '#fff',
                name: 'Time 1',
              };
              const t2 = teams.find((t) => t.id === hist.team2.id) || {
                color: '#fff',
                name: 'Time 2',
              };

              const date = new Date(hist.date).toLocaleDateString();
              const time = new Date(hist.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={`${hist.id}-${i}`}
                  className="bg-zinc-800/50 p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {date} • {time}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
                      Partida {tournamentHistory.length - i}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/10"
                        style={{ backgroundColor: t1.color }}
                      />
                      <span className="font-bold text-sm text-center truncate w-full">
                        {t1.name}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="text-3xl font-black tabular-nums tracking-tighter">
                        {hist.team1.sets} - {hist.team2.sets}
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase">
                        Sets
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/10"
                        style={{ backgroundColor: t2.color }}
                      />
                      <span className="font-bold text-sm text-center truncate w-full">
                        {t2.name}
                      </span>
                    </div>
                  </div>

                  {hist.setHistory && hist.setHistory.length > 0 && (
                    <div className="pt-4 flex flex-wrap gap-2 justify-center border-t border-white/5">
                      {hist.setHistory.map((set, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/50 px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-bold"
                        >
                          <span className="text-zinc-500 mr-1.5 font-black uppercase">
                            S{idx + 1}
                          </span>
                          <span style={{ color: t1.color }}>{set.team1}</span>
                          <span className="mx-1 text-zinc-700">|</span>
                          <span style={{ color: t2.color }}>{set.team2}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
