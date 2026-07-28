import { motion } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { MatchState, Team } from '../types';

interface MatchHeaderProps {
  match: MatchState;
  team1: Team;
  team2: Team;
  timerValue: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

export function MatchHeader({
  match,
  team1,
  team2,
  timerValue,
  isTimerRunning,
  setIsTimerRunning,
  resetTimer,
  formatTime,
}: MatchHeaderProps) {
  const leftTeamSets = match.sidesSwapped ? match.team2Sets : match.team1Sets;
  const rightTeamSets = match.sidesSwapped ? match.team1Sets : match.team2Sets;
  const leftTeamColor = match.sidesSwapped ? team2.color : team1.color;
  const rightTeamColor = match.sidesSwapped ? team1.color : team2.color;

  return (
    <div className="absolute top-[calc(0.75rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-30 px-4 w-full max-w-xl">
      {match.useSets && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl border border-black/10 text-3xl font-black tabular-nums min-w-[70px] text-center shadow-xl"
          style={{ color: leftTeamColor }}
        >
          {leftTeamSets}
        </motion.div>
      )}

      {/* Timer Display */}
      {match.useTimer && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xl font-black tabular-nums text-center shadow-xl cursor-pointer hover:bg-black/80 transition-colors flex items-center gap-3"
          onClick={() => setIsTimerRunning(!isTimerRunning)}
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 shrink-0">
            {isTimerRunning ? (
              <Pause size={14} className="fill-white" />
            ) : (
              <Play size={14} className="fill-white ml-0.5" />
            )}
          </div>
          <span
            className={
              match.timerMode === 'regressive' && timerValue <= 60
                ? 'text-red-400'
                : 'text-white'
            }
          >
            {formatTime(timerValue)}
          </span>
          <button
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              resetTimer();
            }}
            title="Zerar Cronômetro"
          >
            <RotateCcw size={14} />
          </button>
        </motion.div>
      )}

      {match.useSets && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl border border-black/10 text-3xl font-black tabular-nums min-w-[70px] text-center shadow-xl"
          style={{ color: rightTeamColor }}
        >
          {rightTeamSets}
        </motion.div>
      )}
    </div>
  );
}
