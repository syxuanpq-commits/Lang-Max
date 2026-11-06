import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Crown, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Search 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LeaderboardViewProps {
  students: UserProfile[];
  currentUser: UserProfile;
}

export function LeaderboardView({ students, currentUser }: LeaderboardViewProps) {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [search, setSearch] = useState('');

  // Sort students by quiz score descending
  const sortedStudents = [...students].sort((a, b) => (b.quizScore || 0) - (a.quizScore || 0));

  const filtered = sortedStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const top1 = sortedStudents[0];
  const top2 = sortedStudents[1];
  const top3 = sortedStudents[2];

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 flex flex-col h-full justify-between overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Bảng Vinh Danh Học Viên LangMax</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Thi đua tích lũy điểm kinh nghiệm (XP) qua mỗi lượt ôn tập flashcard và làm bài trắc nghiệm.
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700">
          <button
            onClick={() => setFilter('weekly')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'weekly' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setFilter('monthly')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'monthly' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'
            }`}
          >
            Toàn thời gian
          </button>
        </div>
      </div>

      {/* Podium Top 3 */}
      {sortedStudents.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-2xl mx-auto items-end">
          {/* Top 2 */}
          {top2 && (
            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-center space-y-2">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-base shadow-md ${top2.avatarColor || 'bg-indigo-600'}`}>
                  {top2.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs border-2 border-white dark:border-zinc-800">
                  2
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-1">
                {top2.name}
              </p>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {top2.quizScore} XP
              </span>
            </div>
          )}

          {/* Top 1 (Center & Higher) */}
          {top1 && (
            <div className="flex flex-col items-center p-5 rounded-3xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 dark:bg-zinc-800 border-2 border-amber-400 text-center space-y-2 relative -translate-y-2 shadow-lg">
              <Crown className="w-6 h-6 text-amber-500 absolute -top-4 fill-amber-400" />
              <div className="relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg ring-4 ring-amber-400/40 ${top1.avatarColor || 'bg-amber-600'}`}>
                  {top1.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs border-2 border-white dark:border-zinc-800">
                  1
                </div>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 mt-1">
                {top1.name}
              </p>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                {top1.quizScore} XP
              </span>
            </div>
          )}

          {/* Top 3 */}
          {top3 && (
            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-center space-y-2">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-base shadow-md ${top3.avatarColor || 'bg-emerald-600'}`}>
                  {top3.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-zinc-800">
                  3
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-1">
                {top3.name}
              </p>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {top3.quizScore} XP
              </span>
            </div>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm học viên theo tên hoặc email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table Rankings List */}
      <div className="bg-white dark:bg-zinc-800/80 rounded-3xl border border-slate-200/80 dark:border-zinc-700/60 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-zinc-700/50 max-h-[200px] sm:max-h-[260px] overflow-y-auto no-scrollbar">
          {filtered.map((student, index) => {
            const isMe = student.id === currentUser.id;
            const rank = sortedStudents.findIndex(s => s.id === student.id) + 1;

            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                  isMe
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                    : 'hover:bg-slate-50/60 dark:hover:bg-zinc-700/30'
                }`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className={`w-7 text-center font-extrabold text-xs sm:text-sm ${
                    rank === 1 ? 'text-amber-500 font-black' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{rank}
                  </span>

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${student.avatarColor || 'bg-emerald-600'}`}>
                    {student.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      {isMe && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                          Bạn
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {student.level || 'Intermediate'} • {student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>{student.streakDays || 1}d</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {student.quizScore}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
