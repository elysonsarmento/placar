import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings as SettingsIcon,
  X,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Trophy,
  Users,
  ShieldCheck,
  History,
  Monitor,
  Gamepad2,
  Clock,
  Bell,
  RefreshCw,
  Check,
} from 'lucide-react';
import { MatchState, Team, TournamentMatch, generateUUID } from '../types';
import { APP_VERSION } from '../changelog';
import { MatchHistory } from './MatchHistory';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingsTab: 'match' | 'teams' | 'rules' | 'history' | 'system';
  setSettingsTab: (tab: 'match' | 'teams' | 'rules' | 'history' | 'system') => void;
  match: MatchState;
  setMatch: React.Dispatch<React.SetStateAction<MatchState>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  tournamentHistory: TournamentMatch[];
  handleTeamChange: (teamIndex: 1 | 2, newTeamId: string) => void;
  onShowClearConfirm: () => void;
  onOpenChangelog: () => void;
  checkForUpdates: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settingsTab,
  setSettingsTab,
  match,
  setMatch,
  teams,
  setTeams,
  tournamentHistory,
  handleTeamChange,
  onShowClearConfirm,
  onOpenChangelog,
  checkForUpdates,
}: SettingsModalProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
      >
        <div className="bg-zinc-900 w-full max-w-6xl rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[92dvh] max-h-[92dvh] relative">
          {/* Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-zinc-800/30 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="p-3 md:p-4 bg-blue-600/20 text-blue-400 rounded-xl md:rounded-2xl shadow-inner shrink-0">
                <SettingsIcon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">Configurações</h2>
                <p className="text-zinc-500 text-xs sm:text-sm font-medium">Personalize sua experiência no Placar Pro</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 md:p-4 hover:bg-white/10 rounded-full transition-all hover:rotate-90 text-zinc-400 hover:text-white shrink-0"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          <div className="flex-1 flex flex-row overflow-hidden">
            {/* Sidebar Navigation (Vertical) */}
            <div className="w-48 sm:w-60 md:w-80 border-r border-white/10 bg-zinc-900/50 p-3 sm:p-6 md:p-8 flex flex-col gap-2 md:gap-3 overflow-y-auto custom-scrollbar shrink-0">
              <button
                onClick={() => setSettingsTab('match')}
                className={`flex items-center gap-3 md:gap-4 w-full p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl transition-all group ${
                  settingsTab === 'match'
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <Trophy className={`w-5 h-5 md:w-6 md:h-6 ${settingsTab === 'match' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`} />
                <span className="font-bold text-sm sm:text-base md:text-lg">Partida</span>
              </button>
              <button
                onClick={() => setSettingsTab('teams')}
                className={`flex items-center gap-3 md:gap-4 w-full p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl transition-all group ${
                  settingsTab === 'teams'
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <Users className={`w-5 h-5 md:w-6 md:h-6 ${settingsTab === 'teams' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`} />
                <span className="font-bold text-sm sm:text-base md:text-lg">Times</span>
              </button>
              <button
                onClick={() => setSettingsTab('rules')}
                className={`flex items-center gap-3 md:gap-4 w-full p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl transition-all group ${
                  settingsTab === 'rules'
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 md:w-6 md:h-6 ${settingsTab === 'rules' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`} />
                <span className="font-bold text-sm sm:text-base md:text-lg">Regras</span>
              </button>
              <button
                onClick={() => setSettingsTab('history')}
                className={`flex items-center gap-3 md:gap-4 w-full p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl transition-all group ${
                  settingsTab === 'history'
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <History className={`w-5 h-5 md:w-6 md:h-6 ${settingsTab === 'history' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`} />
                <span className="font-bold text-sm sm:text-base md:text-lg">Histórico</span>
              </button>
              <button
                onClick={() => setSettingsTab('system')}
                className={`flex items-center gap-3 md:gap-4 w-full p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl transition-all group ${
                  settingsTab === 'system'
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <Monitor className={`w-5 h-5 md:w-6 md:h-6 ${settingsTab === 'system' ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`} />
                <span className="font-bold text-sm sm:text-base md:text-lg">Sistema</span>
              </button>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="p-3 sm:p-6 bg-zinc-800/30 rounded-2xl md:rounded-3xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed truncate">
                    v{APP_VERSION}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 md:p-12 bg-zinc-900/30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={settingsTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-3xl mx-auto space-y-8 md:space-y-12"
                >
                  {settingsTab === 'match' && (
                    <div className="space-y-6 md:space-y-10">
                      <header>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2">Configuração da Partida</h3>
                        <p className="text-zinc-500 text-xs sm:text-sm">Defina os times e a estrutura da partida atual</p>
                      </header>

                      <div className="grid grid-cols-1 gap-6 md:gap-8">
                        <div className="flex flex-col sm:grid sm:grid-cols-[1fr,auto,1fr] items-center gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-4 w-full">
                            <label className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest">Time Esquerda</label>
                            <div className="relative group">
                              <select
                                className="w-full bg-zinc-800 border-2 border-white/5 rounded-2xl md:rounded-3xl p-4 sm:p-6 text-lg sm:text-xl font-bold appearance-none focus:border-blue-500 outline-none transition-all cursor-pointer pr-12 text-white"
                                value={match.team1Id}
                                onChange={(e) => handleTeamChange(1, e.target.value)}
                              >
                                {teams.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-blue-400 transition-colors rotate-90" size={24} />
                            </div>
                          </div>

                          <div className="pt-2 sm:pt-8">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 shadow-inner">
                              <span className="text-[10px] font-black text-zinc-500">VS</span>
                            </div>
                          </div>

                          <div className="space-y-2 sm:space-y-4 w-full">
                            <label className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest">Time Direita</label>
                            <div className="relative group">
                              <select
                                className="w-full bg-zinc-800 border-2 border-white/5 rounded-2xl md:rounded-3xl p-4 sm:p-6 text-lg sm:text-xl font-bold appearance-none focus:border-blue-500 outline-none transition-all cursor-pointer pr-12 text-white"
                                value={match.team2Id}
                                onChange={(e) => handleTeamChange(2, e.target.value)}
                              >
                                {teams.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-blue-400 transition-colors rotate-90" size={24} />
                            </div>
                          </div>
                        </div>

                        <div className="p-8 bg-zinc-800/50 rounded-[2.5rem] border border-white/5 space-y-8">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl">
                              <Gamepad2 size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white">Estrutura do Jogo</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Modo de Jogo</label>
                              <div className="flex bg-zinc-900 rounded-2xl p-1.5 border border-white/5">
                                <button
                                  onClick={() => setMatch((prev) => ({ ...prev, useSets: true }))}
                                  className={`flex-1 py-4 rounded-xl font-black transition-all text-sm ${
                                    match.useSets ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  Por Sets
                                </button>
                                <button
                                  onClick={() => setMatch((prev) => ({ ...prev, useSets: false }))}
                                  className={`flex-1 py-4 rounded-xl font-black transition-all text-sm ${
                                    !match.useSets ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  Apenas Pontos
                                </button>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                {match.useSets ? 'Pontos por Set' : 'Pontos para Vencer'}
                              </label>
                              <div className="flex items-center justify-between bg-zinc-900 rounded-2xl p-1.5 border border-white/5">
                                <button
                                  onClick={() => setMatch((prev) => ({ ...prev, pointsToWinSet: Math.max(1, prev.pointsToWinSet - 1) }))}
                                  className="p-3 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                  <Minus size={20} />
                                </button>
                                <span className="font-black text-xl text-white w-12 text-center">{match.pointsToWinSet}</span>
                                <button
                                  onClick={() => setMatch((prev) => ({ ...prev, pointsToWinSet: match.pointsToWinSet + 1 }))}
                                  className="p-3 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                  <Plus size={20} />
                                </button>
                              </div>
                            </div>

                            {match.useSets && (
                              <div className="space-y-4 md:col-span-2">
                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Melhor de (Sets)</label>
                                <div className="flex items-center justify-between bg-zinc-900 rounded-2xl p-1.5 border border-white/5 max-w-[50%]">
                                  <button
                                    onClick={() => setMatch((prev) => ({ ...prev, maxSets: Math.max(1, prev.maxSets - 1) }))}
                                    className="p-3 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                  >
                                    <Minus size={20} />
                                  </button>
                                  <span className="font-black text-xl text-white w-12 text-center">{match.maxSets}</span>
                                  <button
                                    onClick={() => setMatch((prev) => ({ ...prev, maxSets: match.maxSets + 1 }))}
                                    className="p-3 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                  >
                                    <Plus size={20} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'teams' && (
                    <div className="space-y-10">
                      <header className="flex justify-between items-end">
                        <div>
                          <h3 className="text-3xl font-black text-white mb-2">Gerenciar Times</h3>
                          <p className="text-zinc-500">Adicione ou edite os times disponíveis</p>
                        </div>
                        <button
                          onClick={() => {
                            const newTeam: Team = { id: generateUUID(), name: 'Novo Time', color: '#6366f1' };
                            setTeams([...teams, newTeam]);
                            setEditingTeam(newTeam);
                          }}
                          className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                        >
                          <Plus size={20} /> Novo Time
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-4">
                        {teams.map((team) => (
                          <div
                            key={team.id}
                            className="flex items-center gap-6 p-6 bg-zinc-800/40 rounded-[2rem] border border-white/5 group hover:border-white/20 transition-all"
                          >
                            <div className="w-16 h-16 rounded-2xl shadow-2xl border-4 border-white/10" style={{ backgroundColor: team.color }} />
                            <div className="flex-1">
                              <span className="block font-black text-xl text-white">{team.name}</span>
                              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{team.color.toUpperCase()}</span>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setEditingTeam(team)}
                                className="p-4 bg-zinc-700/50 hover:bg-zinc-600 text-white rounded-2xl transition-all hover:scale-105"
                              >
                                <SettingsIcon size={24} />
                              </button>
                              <button
                                onClick={() => {
                                  if (teams.length > 2) {
                                    setTeams(teams.filter((t) => t.id !== team.id));
                                  }
                                }}
                                className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all hover:scale-105"
                              >
                                <Trash2 size={24} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {settingsTab === 'rules' && (
                    <div className="space-y-10">
                      <header>
                        <h3 className="text-3xl font-black text-white mb-2">Regras e Display</h3>
                        <p className="text-zinc-500">Ajuste o comportamento e a interface do placar</p>
                      </header>

                      <div className="grid grid-cols-1 gap-6">
                        {/* Timer Section */}
                        <div className="p-8 bg-zinc-800/50 rounded-[2.5rem] border border-white/5 space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl">
                              <Clock size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white">Cronômetro</h4>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200">Ativar Cronômetro</span>
                                <span className="text-xs text-zinc-500">Exibe o tempo no topo da tela</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, useTimer: !prev.useTimer }))}
                                className={`w-16 h-9 rounded-full transition-all relative ${match.useTimer ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${match.useTimer ? 'left-8.5' : 'left-1.5'}`} />
                              </button>
                            </div>

                            {match.useTimer && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-6 pt-6 border-t border-white/5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-zinc-200">Modo do Tempo</span>
                                    <span className="text-xs text-zinc-500">Progressivo ou Regressivo</span>
                                  </div>
                                  <div className="flex bg-zinc-900 rounded-xl p-1">
                                    <button
                                      onClick={() => setMatch((prev) => ({ ...prev, timerMode: 'progressive' }))}
                                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        match.timerMode === 'progressive' ? 'bg-zinc-700 text-white' : 'text-zinc-500'
                                      }`}
                                    >
                                      Progressivo
                                    </button>
                                    <button
                                      onClick={() => setMatch((prev) => ({ ...prev, timerMode: 'regressive' }))}
                                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        match.timerMode === 'regressive' ? 'bg-zinc-700 text-white' : 'text-zinc-500'
                                      }`}
                                    >
                                      Regressivo
                                    </button>
                                  </div>
                                </div>

                                {match.timerMode === 'regressive' && (
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-zinc-200">Duração Inicial</span>
                                      <span className="text-xs text-zinc-500">Minutos para contagem</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <button
                                        onClick={() => setMatch((prev) => ({ ...prev, timerDuration: Math.max(1, prev.timerDuration - 1) }))}
                                        className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 text-white"
                                      >
                                        <Minus size={16} />
                                      </button>
                                      <span className="text-xl font-black w-12 text-center text-white">{match.timerDuration}</span>
                                      <button
                                        onClick={() => setMatch((prev) => ({ ...prev, timerDuration: prev.timerDuration + 1 }))}
                                        className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 text-white"
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Gameplay Rules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-zinc-800/50 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200">Vantagem</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Diferença de 2 pts</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, useAdvantage: !prev.useAdvantage }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.useAdvantage ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.useAdvantage ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200">Travar Placar</span>
                                <span className="text-[10px] text-zinc-500 uppercase">No Set Point</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, stopAtSetPoint: !prev.stopAtSetPoint }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.stopAtSetPoint ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.stopAtSetPoint ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>

                          <div className="p-6 bg-zinc-800/50 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200">Nomes dos Times</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Sempre Visíveis</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, displayTeamNames: !prev.displayTeamNames }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.displayTeamNames ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.displayTeamNames ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200">Trocar Lados</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Botão Central</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, showSwapButton: !prev.showSwapButton }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.showSwapButton ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.showSwapButton ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200">Tela de Vencedor</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Fim de jogo</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, showWinnerOverlay: !prev.showWinnerOverlay }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.showWinnerOverlay ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.showWinnerOverlay ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Audio & Sound Settings */}
                        <div className="p-6 bg-zinc-800/50 rounded-3xl border border-white/5 space-y-6">
                          <h4 className="text-lg font-bold text-white">Sons e Narração por Voz</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200 text-sm">Sons de Ponto</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Efeitos sonoros</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, enableSound: !prev.enableSound }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.enableSound ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.enableSound ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200 text-sm">Apito de Juiz</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Fim de set/tempo</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, enableWhistle: !prev.enableWhistle }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.enableWhistle ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.enableWhistle ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-200 text-sm">Locutor por Voz</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Voz pt-BR</span>
                              </div>
                              <button
                                onClick={() => setMatch((prev) => ({ ...prev, enableVoiceAnnouncer: !prev.enableVoiceAnnouncer }))}
                                className={`w-12 h-7 rounded-full transition-all relative ${match.enableVoiceAnnouncer ? 'bg-blue-600' : 'bg-zinc-700'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${match.enableVoiceAnnouncer ? 'left-6' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'history' && (
                    <MatchHistory
                      tournamentHistory={tournamentHistory}
                      teams={teams}
                      onShowClearConfirm={onShowClearConfirm}
                    />
                  )}

                  {settingsTab === 'system' && (
                    <div className="space-y-10">
                      <header>
                        <h3 className="text-3xl font-black text-white mb-2">Sistema e Manutenção</h3>
                        <p className="text-zinc-500">Informações do app e ferramentas de dados</p>
                      </header>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between p-8 bg-zinc-800/50 rounded-[2.5rem] border border-white/5">
                          <div className="flex items-center gap-5">
                            <div className="p-4 bg-blue-600/20 text-blue-400 rounded-2xl">
                              <Bell size={28} />
                            </div>
                            <div>
                              <span className="block font-black text-xl text-white">Versão do Aplicativo</span>
                              <span className="text-sm text-zinc-500 font-medium">Build v{APP_VERSION}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenChangelog();
                            }}
                            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl transition-all"
                          >
                            Changelog
                          </button>
                        </div>

                        <button
                          onClick={checkForUpdates}
                          className="flex items-center justify-between p-6 bg-zinc-800/50 rounded-3xl border border-white/5 hover:bg-zinc-800 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600/20 text-green-500 rounded-2xl">
                              <RefreshCw size={20} />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-zinc-200">Atualizações</span>
                              <span className="text-[10px] text-zinc-500 uppercase">Verificar nova versão</span>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-zinc-600 group-hover:text-white transition-colors" />
                        </button>

                        <div className="p-8 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl">
                              <Trash2 size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-red-500">Zona de Perigo</h4>
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed">
                            A limpeza do torneio apagará permanentemente todo o histórico de partidas salvas. Esta ação não pode ser desfeita.
                          </p>
                          <button
                            onClick={onShowClearConfirm}
                            className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-3"
                          >
                            <Trash2 size={20} /> Limpar Todos os Dados
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Team Edit Overlay */}
        <AnimatePresence>
          {editingTeam && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
            >
              <div className="bg-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/10 space-y-6 text-white">
                <h4 className="text-xl font-bold">Editar Time</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-500">Nome do Time</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                      value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-zinc-500">Cor do Time</label>
                    <div className="relative w-full h-16 rounded-xl overflow-hidden border-2 border-white/10 focus-within:border-blue-500 transition-colors">
                      <input
                        type="color"
                        value={editingTeam.color}
                        onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                        className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer opacity-0"
                      />
                      <div
                        className="w-full h-full flex items-center justify-center font-mono font-bold text-white drop-shadow-md pointer-events-none"
                        style={{ backgroundColor: editingTeam.color }}
                      >
                        {editingTeam.color.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setTeams(teams.map((t) => (t.id === editingTeam.id ? editingTeam : t)));
                      setEditingTeam(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Salvar
                  </button>
                  <button
                    onClick={() => setEditingTeam(null)}
                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 p-4 rounded-xl font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
