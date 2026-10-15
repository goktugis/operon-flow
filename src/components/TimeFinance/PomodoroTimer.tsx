import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Check, Sparkles, Clock } from 'lucide-react';
import { sound } from '../../utils/audio';

export const PomodoroTimer: React.FC = () => {
  const { tasks, logHours, showToast } = useApp();

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeTasks[0]?.id || '');
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Set time when mode changes
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
  }, [mode]);

  // Timer countdown loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sound.playSuccess();
      if (mode === 'pomodoro' && selectedTaskId) {
        logHours(selectedTaskId, 1);
        showToast('Tebrikler! 25dk odaklanma seansı bitti ve 1 saat çalışma göreve loglandı! 🎯', 'success');
      } else {
        showToast('Mola süreniz bitti! Yeniden odaklanmaya hazır mısınız? 🚀', 'info');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, selectedTaskId, logHours, showToast]);

  const toggleStart = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Derin Odaklanma Kronometresi</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Pomodoro v2
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
          <button
            onClick={() => setMode('pomodoro')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'pomodoro'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            25dk Odak
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5dk Mola
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            15dk Uzun Mola
          </button>
        </div>

        {/* Big Countdown Display */}
        <div className="py-6 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl sm:text-6xl font-black tracking-wider text-white">
            {timeFormatted}
          </span>
          <p className="text-xs text-slate-400 mt-2">
            {isRunning ? '⏳ Zaman akıyor, odaklanmayı sürdürün...' : '⏸ Hazır olduğunuzda başlatın'}
          </p>
        </div>

        {/* Task Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Çalışılan Görev (Süre bitince otomatik loglanır)
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {activeTasks.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.status.toUpperCase()}] {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleStart}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Duraklat' : 'Seansı Başlat'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
