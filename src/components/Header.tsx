import React from 'react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  Sun, 
  Moon, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  GraduationCap
} from 'lucide-react';
import { DeviceMode, ThemeMode, UserProfile } from '../types';

interface HeaderProps {
  device: DeviceMode;
  onSetDevice: (device: DeviceMode) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickSwitchRole: (role: 'student' | 'admin') => void;
}

export function Header({
  device,
  onSetDevice,
  theme,
  onToggleTheme,
  currentUser,
  onOpenLogin,
  onLogout,
  onQuickSwitchRole
}: HeaderProps) {
  return (
    <header className="h-11 sm:h-12 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Brand & Platform title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                LangMax
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 uppercase">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 hidden sm:block font-medium">
              English Lexicon Mastery & Assessment
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Device Emulator Selector (Icon Only) */}
      <div className="flex items-center bg-slate-100 dark:bg-zinc-800/80 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-zinc-700/60 space-x-0.5">
        <button
          onClick={() => onSetDevice('laptop')}
          className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-all ${
            device === 'laptop'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50'
          }`}
          title="Giao diện Máy tính (Laptop)"
          aria-label="Khung xem Laptop"
        >
          <Laptop className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSetDevice('ipad')}
          className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-all ${
            device === 'ipad'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50'
          }`}
          title="Giao diện Máy tính bảng (iPad)"
          aria-label="Khung xem iPad"
        >
          <Tablet className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSetDevice('phone')}
          className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-all ${
            device === 'phone'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50'
          }`}
          title="Giao diện Điện thoại (Mobile)"
          aria-label="Khung xem Điện thoại"
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Right controls: Theme, Role switcher, User account */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Theme mode toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          aria-label="Đổi giao diện Sáng / Tối"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Quick Demo Switcher if user logged in */}
        {currentUser && (
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-700/60">
            <button
              onClick={() => onQuickSwitchRole('student')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentUser.role === 'student'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Chuyển sang vai trò Học viên"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Học viên</span>
            </button>
            <button
              onClick={() => onQuickSwitchRole('admin')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Chuyển sang vai trò Quản trị viên"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quản trị viên</span>
            </button>
          </div>
        )}

        {/* User state / Sign in button */}
        {!currentUser ? (
          <button
            onClick={onOpenLogin}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                currentUser.avatarColor || (currentUser.role === 'admin' ? 'bg-amber-600' : 'bg-emerald-600')
              }`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 capitalize">
                  {currentUser.role === 'admin' ? 'Quản trị viên' : `${currentUser.level || 'Học viên'}`}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Đăng xuất"
              aria-label="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
