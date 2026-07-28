/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Settings as SettingsIcon, RotateCcw, ArrowLeftRight, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Team, MatchState, TournamentMatch, DEFAULT_TEAMS, generateUUID } from './types';
import { APP_VERSION, CHANGELOG } from './changelog';
import { useKeepAwake } from './hooks/useKeepAwake';
import { useMatchTimer } from './hooks/useMatchTimer';
import { MatchHeader } from './components/MatchHeader';
import { ScoreCard } from './components/ScoreCard';
import { SettingsModal } from './components/SettingsModal';
import { playPointSound, playMinusSound, playWhistleSound, speakScore, speakText } from './utils/audio';

export default function App() {
  const {
    needRefresh: [, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  const checkForUpdates = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().then(() => {
          alert('Verificação concluída. Se houver atualização, o botão de atualizar aparecerá.');
        });
      });
    } else {
      alert('Service Worker não suportado neste navegador.');
    }
  };

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('placar_teams');
    return saved ? JSON.parse(saved) : DEFAULT_TEAMS;
  });

  const [match, setMatch] = useState<MatchState>(() => {
    const saved = localStorage.getItem('placar_match');
    const defaultMatch: MatchState = {
      team1Id: '1',
      team2Id: '2',
      team1Score: 0,
      team2Score: 0,
      team1Sets: 0,
      team2Sets: 0,
      maxSets: 3,
      pointsToWinSet: 25,
      setHistory: [],
      pointHistory: [],
      useSets: true,
      displayTeamNames: false,
      sidesSwapped: false,
      showSwapButton: true,
      showWinnerOverlay: true,
      keepScreenAwake: false,
      stopAtSetPoint: false,
      useAdvantage: true,
      useTimer: false,
      timerMode: 'progressive',
      timerDuration: 0,
      enableSound: true,
      enableWhistle: true,
      enableVoiceAnnouncer: false,
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultMatch,
          ...parsed,
          setHistory: parsed.setHistory || [],
          pointHistory: parsed.pointHistory || [],
          useSets: parsed.useSets !== undefined ? parsed.useSets : true,
          displayTeamNames: parsed.displayTeamNames !== undefined ? parsed.displayTeamNames : false,
          sidesSwapped: parsed.sidesSwapped || false,
          showSwapButton: parsed.showSwapButton !== undefined ? parsed.showSwapButton : true,
          showWinnerOverlay: parsed.showWinnerOverlay !== undefined ? parsed.showWinnerOverlay : true,
          keepScreenAwake: parsed.keepScreenAwake || false,
          stopAtSetPoint: parsed.stopAtSetPoint || false,
          useAdvantage: parsed.useAdvantage !== undefined ? parsed.useAdvantage : true,
          useTimer: parsed.useTimer || false,
          timerMode: parsed.timerMode || 'progressive',
          timerDuration: parsed.timerDuration !== undefined ? parsed.timerDuration : 0,
          enableSound: parsed.enableSound !== undefined ? parsed.enableSound : true,
          enableWhistle: parsed.enableWhistle !== undefined ? parsed.enableWhistle : true,
          enableVoiceAnnouncer: parsed.enableVoiceAnnouncer || false,
        };
      } catch (e) {
        return defaultMatch;
      }
    }
    return defaultMatch;
  });

  const [tournamentHistory, setTournamentHistory] = useState<TournamentMatch[]>(() => {
    const saved = localStorage.getItem('placar_tournament_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('placar_tournament_history', JSON.stringify(tournamentHistory));
  }, [tournamentHistory]);

  useEffect(() => {
    localStorage.setItem('placar_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('placar_match', JSON.stringify(match));
  }, [match]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const isProcessingSetRef = useRef(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'match' | 'teams' | 'rules' | 'history' | 'system'>('match');

  // Custom Hooks
  useKeepAwake(match.keepScreenAwake);
  const { timerValue, isTimerRunning, setIsTimerRunning, resetTimer, formatTime } = useMatchTimer({
    timerMode: match.timerMode,
    timerDuration: match.timerDuration,
  });

  useEffect(() => {
    const lastSeen = localStorage.getItem('placar_last_version');
    if (lastSeen !== APP_VERSION) {
      setIsChangelogOpen(true);
      localStorage.setItem('placar_last_version', APP_VERSION);
    }
  }, []);

  const updateScore = useCallback((teamNum: 1 | 2, delta: number) => {
    if (delta > 0) {
      if (match.enableSound) playPointSound();
    } else if (delta < 0) {
      if (match.enableSound) playMinusSound();
    }

    setMatch((prev: MatchState) => {
      const scoreKey = teamNum === 1 ? 'team1Score' : 'team2Score';
      
      if (delta > 0 && prev.stopAtSetPoint) {
        const t1Wins = prev.team1Score >= prev.pointsToWinSet && (!prev.useAdvantage || prev.team1Score >= prev.team2Score + 2);
        const t2Wins = prev.team2Score >= prev.pointsToWinSet && (!prev.useAdvantage || prev.team2Score >= prev.team1Score + 2);
        if (t1Wins || t2Wins) return prev;
      }

      const newScore = Math.max(0, prev[scoreKey] + delta);
      const nextT1 = teamNum === 1 ? newScore : prev.team1Score;
      const nextT2 = teamNum === 2 ? newScore : prev.team2Score;

      if (delta > 0 && prev.enableVoiceAnnouncer) {
        speakScore(nextT1, nextT2);
      }
      
      let newPointHistory = [...(prev.pointHistory || [])];
      if (delta > 0) {
        for (let i = 0; i < delta; i++) {
          newPointHistory.push(teamNum);
        }
      } else if (delta < 0) {
        for (let i = 0; i < Math.abs(delta); i++) {
          const lastIndex = newPointHistory.lastIndexOf(teamNum);
          if (lastIndex !== -1) {
            newPointHistory.splice(lastIndex, 1);
          }
        }
      }

      return { 
        ...prev, 
        [scoreKey]: newScore, 
        pointHistory: newPointHistory
      };
    });
  }, [match.enableSound, match.enableVoiceAnnouncer]);

  const nextSet = useCallback((winner: 1 | 2) => {
    if (isProcessingSetRef.current) return;
    isProcessingSetRef.current = true;

    if (match.enableWhistle) playWhistleSound(1.0);
    if (match.enableVoiceAnnouncer) speakText('Fim de Set');

    setMatch((prev: MatchState) => ({
      ...prev,
      setHistory: [...prev.setHistory, { team1: prev.team1Score, team2: prev.team2Score }],
      team1Score: 0,
      team2Score: 0,
      team1Sets: winner === 1 ? prev.team1Sets + 1 : prev.team1Sets,
      team2Sets: winner === 2 ? prev.team2Sets + 1 : prev.team2Sets,
      pointHistory: [],
    }));

    setTimeout(() => {
      isProcessingSetRef.current = false;
    }, 500);
  }, [match.enableWhistle, match.enableVoiceAnnouncer]);

  const resetMatch = useCallback((fullReset = false) => {
    setMatch((prev: MatchState) => ({
      ...prev,
      team1Score: 0,
      team2Score: 0,
      pointHistory: [],
      ...(fullReset ? { team1Sets: 0, team2Sets: 0, setHistory: [] } : {})
    }));
  }, []);

  const handleTeamChange = useCallback((teamIndex: 1 | 2, newTeamId: string) => {
    if (match.team1Score > 0 || match.team2Score > 0 || match.team1Sets > 0 || match.team2Sets > 0) {
      const finalSetHistory = (match.team1Score > 0 || match.team2Score > 0) 
        ? [...match.setHistory, { team1: match.team1Score, team2: match.team2Score }]
        : match.setHistory;

      setTournamentHistory((th: TournamentMatch[]) => [...th, {
        id: generateUUID(),
        date: new Date().toISOString(),
        team1: { id: match.team1Id, score: match.team1Score, sets: match.team1Sets },
        team2: { id: match.team2Id, score: match.team2Score, sets: match.team2Sets },
        setHistory: finalSetHistory
      }]);
    }
    
    setMatch((prev: MatchState) => ({
      ...prev,
      [teamIndex === 1 ? 'team1Id' : 'team2Id']: newTeamId,
      team1Score: 0,
      team2Score: 0,
      team1Sets: 0,
      team2Sets: 0,
      setHistory: [],
      pointHistory: [],
    }));
  }, [match]);

  const team1 = teams.find(t => t.id === match.team1Id) || teams[0];
  const team2 = teams.find(t => t.id === match.team2Id) || teams[1];

  const team1WinsSet = match.team1Score >= match.pointsToWinSet && (!match.useAdvantage || match.team1Score >= match.team2Score + 2);
  const team2WinsSet = match.team2Score >= match.pointsToWinSet && (!match.useAdvantage || match.team2Score >= match.team1Score + 2);

  const setsToWin = Math.ceil(match.maxSets / 2);
  const matchWinner: 1 | 2 | null = match.useSets 
    ? (match.team1Sets >= setsToWin ? 1 : match.team2Sets >= setsToWin ? 2 : null) 
    : (team1WinsSet ? 1 : team2WinsSet ? 2 : null);

  const showTeam1CloseBtn = team1WinsSet && (match.useSets ? !matchWinner : !match.showWinnerOverlay);
  const showTeam2CloseBtn = team2WinsSet && (match.useSets ? !matchWinner : !match.showWinnerOverlay);

  const team1ScoreCardProps = {
    team: team1,
    score: match.team1Score,
    teamNum: 1 as const,
    matchWinner,
    showCloseBtn: showTeam1CloseBtn,
    displayTeamNames: match.displayTeamNames,
    sidesSwapped: match.sidesSwapped,
    useSets: match.useSets,
    onUpdateScore: updateScore,
    onNextSet: nextSet,
    onResetMatch: resetMatch,
  };

  const team2ScoreCardProps = {
    team: team2,
    score: match.team2Score,
    teamNum: 2 as const,
    matchWinner,
    showCloseBtn: showTeam2CloseBtn,
    displayTeamNames: match.displayTeamNames,
    sidesSwapped: match.sidesSwapped,
    useSets: match.useSets,
    onUpdateScore: updateScore,
    onNextSet: nextSet,
    onResetMatch: resetMatch,
  };

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] text-white font-sans overflow-hidden select-none bg-black">
      {/* Top Center Displays (Sets & Timer) */}
      <MatchHeader
        match={match}
        team1={team1}
        team2={team2}
        timerValue={timerValue}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
        resetTimer={resetTimer}
        formatTime={formatTime}
      />

      {/* Main Scoreboard */}
      <div className={`flex h-full w-full ${match.sidesSwapped ? 'flex-col-reverse landscape:flex-row-reverse' : 'flex-col landscape:flex-row'}`}>
        <ScoreCard {...team1ScoreCardProps} />
        <div className="h-1 w-full landscape:w-1 landscape:h-full bg-black/30 z-10" />
        <ScoreCard {...team2ScoreCardProps} />
      </div>

      {/* Bottom Displays (Timeline & History) */}
      <div className="absolute bottom-[calc(0.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 w-full max-w-[90vw] pointer-events-none [&>*]:pointer-events-auto">
        {/* Point Timeline */}
        {match.pointHistory && match.pointHistory.length > 0 && (
          <div className="flex gap-1 overflow-x-auto custom-scrollbar px-3 py-1.5 items-center bg-zinc-900/90 rounded-full backdrop-blur-md border border-white/20 shadow-2xl max-w-full">
            {match.pointHistory.map((teamNum, idx) => {
              const teamColor = teamNum === 1 ? team1.color : team2.color;
              return (
                <div 
                  key={idx}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 shadow-sm border-2 border-white/90"
                  style={{ backgroundColor: teamColor }}
                  title={`Ponto ${idx + 1}`}
                />
              );
            })}
          </div>
        )}

        {/* Bottom History Display */}
        {match.useSets && match.setHistory && match.setHistory.length > 0 && (
          <div className="w-full flex flex-col items-center gap-1">
            <div className="flex items-center justify-center w-full max-w-xs px-2">
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Sets da Partida Atual
               </span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 px-4 max-w-full">
                {(match.setHistory || []).map((set, i) => (
                  <div key={i} className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-black/10 flex flex-col items-center min-w-[65px] shadow-lg shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Set {i + 1}</span>
                    <div className={`flex gap-1.5 font-bold text-sm sm:text-base ${match.sidesSwapped ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span style={{ color: team1.color }}>{set.team1}</span>
                      <span className="text-zinc-300">|</span>
                      <span style={{ color: team2.color }}>{set.team2}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {matchWinner && match.showWinnerOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold uppercase tracking-[0.5em] text-zinc-400">Vencedor da Partida</h2>
              <div className="text-8xl font-black uppercase tracking-tighter" style={{ color: matchWinner === 1 ? team1.color : team2.color }}>
                {matchWinner === 1 ? team1.name : team2.name}
              </div>
              <div className="text-2xl font-medium text-zinc-500">
                Placar Final: {match.sidesSwapped ? match.team2Sets : match.team1Sets} - {match.sidesSwapped ? match.team1Sets : match.team2Sets}
              </div>
              <button 
                onClick={() => resetMatch(true)}
                className="mt-12 px-12 py-6 bg-white text-black rounded-full font-black text-2xl hover:scale-105 active:scale-95 transition-transform shadow-2xl"
              >
                NOVA PARTIDA
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Controls */}
      {!(matchWinner && match.showWinnerOverlay) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-40 bg-black/60 backdrop-blur-xl p-2 rounded-full border border-white/15 shadow-2xl items-center">
          {match.showSwapButton && (
            <button 
              className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-all rounded-full border border-white/10 active:scale-90 text-white"
              onClick={() => setMatch(prev => ({ ...prev, sidesSwapped: !prev.sidesSwapped }))}
              title="Trocar Lados"
            >
              <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          <button 
            className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-all rounded-full border border-white/10 active:scale-90 text-white"
            onClick={() => setShowResetConfirm(true)}
            title="Zerar placar"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-all rounded-full border border-white/10 active:scale-90 text-white"
            onClick={() => setIsSettingsOpen(true)}
            title="Configurações"
          >
            <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
        match={match}
        setMatch={setMatch}
        teams={teams}
        setTeams={setTeams}
        tournamentHistory={tournamentHistory}
        handleTeamChange={handleTeamChange}
        onShowClearConfirm={() => setShowClearConfirm(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        checkForUpdates={checkForUpdates}
      />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-3">Zerar Placar?</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Deseja zerar a pontuação dos times no set atual?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-4 rounded-xl font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    resetMatch(false);
                    setShowResetConfirm(false);
                  }}
                  className="flex-[1.5] py-4 rounded-xl font-black bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                  Sim, Zerar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Tournament Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-3">Limpar Torneio?</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Tem certeza que deseja apagar todo o histórico do torneio? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-4 rounded-xl font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setTournamentHistory([]);
                    localStorage.removeItem('placar_tournament_history');
                    setMatch(prev => ({
                      ...prev,
                      team1Score: 0,
                      team2Score: 0,
                      team1Sets: 0,
                      team2Sets: 0,
                      setHistory: [],
                    }));
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 transition-colors"
                >
                  Sim, limpar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Changelog Modal */}
      <AnimatePresence>
        {isChangelogOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            <div className="bg-zinc-900 w-full max-w-2xl rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[88dvh] max-h-[88dvh]">
              <div className="p-4 sm:p-8 border-b border-white/10 flex justify-between items-center bg-zinc-800/30 shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-blue-500/20 text-blue-400 rounded-xl sm:rounded-2xl shrink-0">
                    <Info className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Novidades</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm">O que há de novo no Placar Pro</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChangelogOpen(false)}
                  className="p-2 sm:p-3 hover:bg-white/10 rounded-full transition-colors shrink-0"
                >
                  <X className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </div>

              <div className="p-4 sm:p-8 overflow-y-auto space-y-6 sm:space-y-8 custom-scrollbar flex-1">
                {CHANGELOG.map((log, index) => (
                  <div key={log.version} className={`relative ${index !== CHANGELOG.length - 1 ? 'pb-6 sm:pb-8 border-b border-white/5' : ''}`}>
                    <div className="flex items-baseline gap-3 mb-3 sm:mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">v{log.version}</h3>
                      <span className="text-xs sm:text-sm font-medium text-zinc-500">{log.date}</span>
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {log.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-base text-zinc-300">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="p-4 sm:p-6 border-t border-white/10 bg-zinc-800/30 flex justify-end shrink-0">
                <button 
                  onClick={() => setIsChangelogOpen(false)}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl sm:rounded-2xl transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
