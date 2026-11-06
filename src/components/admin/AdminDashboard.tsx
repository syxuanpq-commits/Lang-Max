import React from 'react';
import { 
  Users, 
  Layers, 
  FileUp, 
  CheckSquare, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  PlusCircle,
  BookOpen
} from 'lucide-react';
import { AdminTab, DeviceMode, Flashcard, UserProfile } from '../../types';

interface AdminDashboardProps {
  students: UserProfile[];
  flashcards: Flashcard[];
  onNavigateTab: (tab: AdminTab) => void;
  device?: DeviceMode;
}

export function AdminDashboard({
  students,
  flashcards,
  onNavigateTab,
  device
}: AdminDashboardProps) {
  const totalScore = students.reduce((acc, s) => acc + (s.quizScore || 0), 0);
  const avgScore = students.length > 0 ? Math.round(totalScore / students.length) : 0;
  const activeStudents = students.filter(s => s.status === 'Hoạt động').length;
  const totalCards = flashcards.length;

  const isPhone = device === 'phone';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* KPI Cards (Compact Height) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400">Tổng số học viên</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{students.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">({activeStudents} đang học)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tài khoản học trực tuyến</p>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400">Ngân hàng từ vựng</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{totalCards}</span>
            <span className="text-xs text-slate-400">thẻ chuẩn hóa</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Kèm phiên âm, ví dụ & audio</p>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400">Điểm Quiz trung bình</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{avgScore}</span>
            <span className="text-xs text-emerald-600 font-semibold">XP / học viên</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tăng trưởng ổn định</p>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400">Đề trắc nghiệm sinh ra</span>
            <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{Math.round(totalCards * 1.5)}</span>
            <span className="text-xs text-slate-400">câu hỏi</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tự động tạo đa dạng định dạng</p>
        </div>
      </div>

    </div>
  );
}
