import { motion, AnimatePresence } from 'motion/react';
import { Minus } from 'lucide-react';
import { Team } from '../types';

interface ScoreCardProps {
  team: Team;
  score: number;
  teamNum: 1 | 2;
  matchWinner: 1 | 2 | null;
  showCloseBtn: boolean;
  displayTeamNames: boolean;
  sidesSwapped: boolean;
  useSets: boolean;
  onUpdateScore: (teamNum: 1 | 2, delta: number) => void;
  onNextSet: (winner: 1 | 2) => void;
  onResetMatch: (force?: boolean) => void;
}

export function ScoreCard({
  team,
  score,
  teamNum,
  matchWinner,
  showCloseBtn,
  displayTeamNames,
  sidesSwapped,
  useSets,
  onUpdateScore,
  onNextSet,
  onResetMatch,
}: ScoreCardProps) {
  const isTeam1 = teamNum === 1;
  const paddingClasses = 'py-12 landscape:py-8 px-4';

  // O botão de subtrair ponto fica sempre no canto externo da tela (esquerda para a metade esquerda visual, direita para a metade direita visual)
  const isVisualLeft = (isTeam1 && !sidesSwapped) || (!isTeam1 && sidesSwapped);
  const decrementButtonPosition = isVisualLeft
    ? 'left-6 landscape:left-8'
    : 'right-6 landscape:right-8';

  return (
    <div
      className={`relative flex-1 min-h-0 min-w-0 flex flex-col items-center justify-center cursor-pointer active:opacity-95 transition-all ${paddingClasses}`}
      style={{ backgroundColor: team.color }}
      onClick={() => !matchWinner && onUpdateScore(teamNum, 1)}
    >
      {displayTeamNames && (
        <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] text-2xl landscape:text-3xl font-bold uppercase tracking-[0.3em] opacity-90 drop-shadow-md z-10 text-center px-4">
          {team.name}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center max-w-full">
        <motion.div
          key={score}
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`font-black leading-none tabular-nums drop-shadow-2xl transition-all duration-300 ${
            score >= 100
              ? 'text-[5rem] landscape:text-[10rem]'
              : score >= 10
              ? 'text-[7rem] landscape:text-[14rem]'
              : 'text-[9rem] landscape:text-[18rem]'
          }`}
        >
          {score}
        </motion.div>
      </div>

      {/* Next Set Button Overlay */}
      <AnimatePresence>
        {showCloseBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute top-1/2 -translate-y-1/2 bg-white text-black px-8 py-4 landscape:px-12 landscape:py-6 rounded-full font-black text-xl landscape:text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform z-30 border-2 border-black/10"
            onClick={(e) => {
              e.stopPropagation();
              if (useSets) onNextSet(teamNum);
              else onResetMatch(true);
            }}
          >
            FECHAR SET
          </motion.button>
        )}
      </AnimatePresence>

      {/* Decrement Button */}
      <button
        className={`absolute bottom-4 landscape:bottom-6 ${decrementButtonPosition} p-3 landscape:p-3.5 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-all border border-white/10 z-20 active:scale-90 shadow-lg`}
        onClick={(e) => {
          e.stopPropagation();
          onUpdateScore(teamNum, -1);
        }}
        title="Subtrair Ponto"
      >
        <Minus className="w-5 h-5 landscape:w-6 landscape:h-6 text-white" />
      </button>
    </div>
  );
}
