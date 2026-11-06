import React from 'react';
import { 
  Flame, 
  Layers, 
  BrainCircuit, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Play
} from 'lucide-react';
import { Deck, DeviceMode, Flashcard, StudentTab, UserProfile } from '../../types';

interface StudentDashboardProps {
  currentUser: UserProfile;
  decks: Deck[];
  flashcards: Flashcard[];
  onNavigateTab: (tab: StudentTab) => void;
  onSelectDeck: (deckId: string) => void;
  onShowToast: (message?: string, type?: 'success' | 'error' | 'info') => void;
  device?: DeviceMode;
}

export function StudentDashboard({
  currentUser,
  decks,
  flashcards,
  onNavigateTab,
  onSelectDeck,
  onShowToast,
  device
}: StudentDashboardProps) {
  const masteredCount = flashcards.filter(c => c.masteryLevel === 2).length;
  const learningCount = flashcards.filter(c => c.masteryLevel === 1).length;
  const totalCards = flashcards.length;
  const progressPercent = totalCards > 0 ? Math.round(((masteredCount * 1 + learningCount * 0.5) / totalCards) * 100) : 0;

  const handleStartDeck = (deckId: string) => {
    onSelectDeck(deckId);
    onNavigateTab('student-flashcard');
  };

  const isPhone = device === 'phone';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Metrics Row (Compact Height & Overflow Safe) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 truncate">Từ đã ghi nhớ</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white shrink-0">{masteredCount}</span>
            <span className="text-[11px] text-slate-400 truncate">/ {totalCards} từ</span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 truncate">Điểm Quiz đạt được</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white shrink-0">{currentUser.quizScore}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">XP</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 truncate">Chuỗi ngày học</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white shrink-0">{currentUser.streakDays || 1}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold shrink-0">ngày</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 truncate">Học phần kích hoạt</span>
            <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1 min-w-0">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white shrink-0">{decks.length}</span>
            <span className="text-xs text-slate-400 shrink-0">chủ đề</span>
          </div>
        </div>
      </div>

    </div>
  );
}
