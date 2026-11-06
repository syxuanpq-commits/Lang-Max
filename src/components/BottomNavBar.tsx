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
  CheckSquare 
} from 'lucide-react';
import { AdminTab, StudentTab, UserProfile } from '../types';

interface BottomNavBarProps {
  currentUser: UserProfile | null;
  currentStudentTab: StudentTab;
  currentAdminTab: AdminTab;
  onSelectStudentTab: (tab: StudentTab) => void;
  onSelectAdminTab: (tab: AdminTab) => void;
}

export function BottomNavBar({
  currentUser,
  currentStudentTab,
  currentAdminTab,
  onSelectStudentTab,
  onSelectAdminTab
}: BottomNavBarProps) {
  if (!currentUser) return null;

  const isStudent = currentUser.role === 'student';

  const studentTabs = [
    { id: 'student-dashboard' as StudentTab, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'student-flashcard' as StudentTab, label: 'Flashcard', icon: Layers },
    { id: 'student-quiz' as StudentTab, label: 'Quiz', icon: HelpCircle },
    { id: 'student-leaderboard' as StudentTab, label: 'Bảng điểm', icon: Trophy },
    { id: 'student-history' as StudentTab, label: 'Sổ từ', icon: History }
  ];

  const adminTabs = [
    { id: 'admin-dashboard' as AdminTab, label: 'Thống kê', icon: BarChart3 },
    { id: 'admin-students' as AdminTab, label: 'Học viên', icon: Users },
    { id: 'admin-import' as AdminTab, label: 'Nhập AI', icon: FileUp },
    { id: 'admin-curriculum' as AdminTab, label: 'Học phần', icon: BookOpen },
    { id: 'admin-quiz' as AdminTab, label: 'Ngân hàng', icon: CheckSquare }
  ];

  return (
    <div className="h-14 bg-white/95 dark:bg-zinc-900/95 border-t border-slate-200 dark:border-zinc-800 backdrop-blur-md px-2 flex items-center justify-around z-30 select-none">
      {isStudent ? (
        studentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStudentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectStudentTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
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
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-amber-600 dark:text-amber-400' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })
      )}
    </div>
  );
}
