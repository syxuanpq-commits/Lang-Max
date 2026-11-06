import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  HelpCircle, 
  Trophy, 
  History, 
  BarChart3, 
  Users, 
  FileUp, 
  BookOpen, 
  CheckSquare, 
  Sparkles 
} from 'lucide-react';
import { AdminTab, DeviceMode, StudentTab, UserProfile } from '../types';

interface SubnavProps {
  device: DeviceMode;
  currentUser: UserProfile | null;
  currentStudentTab: StudentTab;
  currentAdminTab: AdminTab;
  onSelectStudentTab: (tab: StudentTab) => void;
  onSelectAdminTab: (tab: AdminTab) => void;
  onOpenLogin: () => void;
}

export function Subnav({
  device,
  currentUser,
  currentStudentTab,
  currentAdminTab,
  onSelectStudentTab,
  onSelectAdminTab,
  onOpenLogin
}: SubnavProps) {
  // If not logged in, show simple welcoming subnav prompt
  if (!currentUser) {
    return (
      <div className="h-11 sm:h-12 border-b border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Chào mừng bạn đến với LangMax. Đăng nhập để lưu tiến độ học tập và câu hỏi trắc nghiệm.</span>
        </div>
        <button
          onClick={onOpenLogin}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Đăng nhập ngay &rarr;
        </button>
      </div>
    );
  }

  const isStudent = currentUser.role === 'student';

  const studentTabs: { id: StudentTab; label: string; icon: React.ElementType }[] = [
    { id: 'student-dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'student-flashcard', label: 'Thẻ Flashcard', icon: Layers },
    { id: 'student-quiz', label: 'Luyện Quiz', icon: HelpCircle },
    { id: 'student-leaderboard', label: 'Bảng xếp hạng', icon: Trophy },
    { id: 'student-history', label: 'Sổ tay từ vựng', icon: History }
  ];

  const adminTabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'admin-dashboard', label: 'Thống kê tổng quan', icon: BarChart3 },
    { id: 'admin-students', label: 'Quản lý học viên', icon: Users },
    { id: 'admin-import', label: 'Nhập từ vựng AI', icon: FileUp },
    { id: 'admin-curriculum', label: 'Ngân hàng học phần', icon: BookOpen },
    { id: 'admin-quiz', label: 'Ngân hàng đề Quiz', icon: CheckSquare }
  ];

  return (
    <nav className="h-11 sm:h-12 border-b border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 overflow-x-auto touch-pan-x scroll-smooth snap-x no-scrollbar-ie">
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {isStudent ? (
          studentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentStudentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectStudentTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap snap-start ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })
        ) : (
          adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectAdminTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap snap-start ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Role Indicator Badge (Visible on all devices, but more compact) */}
      <div className="flex items-center space-x-2 pl-4 shrink-0">
        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${
          isStudent 
            ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
        }`}>
          <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-1 sm:mr-1.5 ${isStudent ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="hidden xs:inline">{isStudent ? 'Học viên' : 'Quản trị'}</span>
          <span className="xs:hidden">{isStudent ? 'HV' : 'AD'}</span>
        </span>
      </div>
    </nav>
  );
}
