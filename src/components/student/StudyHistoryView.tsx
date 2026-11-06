import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter 
} from 'lucide-react';
import { Flashcard, UserProfile } from '../../types';
import { speakWord } from '../../utils/audio';

interface StudyHistoryViewProps {
  currentUser: UserProfile;
  flashcards: Flashcard[];
}

export function StudyHistoryView({ currentUser, flashcards }: StudyHistoryViewProps) {
  const [filterLevel, setFilterLevel] = useState<'all' | '0' | '1' | '2'>('all');
  const [search, setSearch] = useState('');

  const filtered = flashcards.filter(c => {
    if (filterLevel !== 'all' && c.masteryLevel !== parseInt(filterLevel)) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.word.toLowerCase().includes(q) ||
        c.vietnamese.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countMastered = flashcards.filter(c => c.masteryLevel === 2).length;
  const countLearning = flashcards.filter(c => c.masteryLevel === 1).length;
  const countNew = flashcards.filter(c => c.masteryLevel === 0).length;

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 flex flex-col h-full justify-between overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BookMarked className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Sổ Tay & Lịch Sử Ghi Nhớ Từ Vựng</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Theo dõi tình trạng ghi nhớ của từng từ vựng và tự kiểm tra tiến trình học của bạn.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterLevel === 'all'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Tất cả ({flashcards.length})
          </button>
          <button
            onClick={() => setFilterLevel('2')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterLevel === '2'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Đã thuộc ({countMastered})
          </button>
          <button
            onClick={() => setFilterLevel('1')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterLevel === '1'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Đang học ({countLearning})
          </button>
          <button
            onClick={() => setFilterLevel('0')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterLevel === '0'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Chưa nhớ ({countNew})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tra cứu từ vựng theo tiếng Anh hoặc nghĩa tiếng Việt..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[260px] sm:max-h-[360px] overflow-y-auto no-scrollbar pr-1">
        {filtered.map((card) => (
          <div
            key={card.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {card.word}
                  </h3>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    {card.phonetic}
                  </span>
                  <button
                    onClick={() => speakWord(card.word)}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  card.masteryLevel === 2
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                    : card.masteryLevel === 1
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                }`}>
                  {card.masteryLevel === 2 ? 'Đã thuộc' : card.masteryLevel === 1 ? 'Đang học' : 'Chưa nhớ'}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                {card.vietnamese}
              </p>

              <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                "{card.definition}"
              </p>

              {card.exampleEn && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 text-xs text-slate-600 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800">
                  <p className="font-medium text-indigo-600 dark:text-indigo-400">{card.exampleEn}</p>
                  {card.exampleVi && <p className="text-slate-400 mt-0.5">{card.exampleVi}</p>}
                </div>
              )}
            </div>

            {card.collocations && card.collocations.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 dark:border-zinc-700/50">
                {card.collocations.map((c, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-700/60 text-slate-600 dark:text-zinc-300">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
