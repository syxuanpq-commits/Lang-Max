import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  Check, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { UserProfile, isAuthorizedAdminEmail } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  availableStudents: UserProfile[];
  onSaveStudentPassword: (email: string, password: string, name?: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
  availableStudents,
  onSaveStudentPassword
}: AuthModalProps) {
  const [tab, setTab] = useState<'quick' | 'student-login' | 'admin-login' | 'register'>('quick');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectQuickStudent = (student: UserProfile) => {
    onLogin(student);
  };

  const handleAdminQuickLogin = () => {
    const adminUser: UserProfile = {
      id: 'admin-1',
      name: 'Quản trị viên',
      email: 'syxuanpq@gmail.com',
      role: 'admin',
      level: 'Advanced',
      completedLessons: 0,
      totalLessons: 25,
      quizScore: 0,
      streakDays: 0,
      status: 'Hoạt động',
      joinedDate: '2026-01-01',
      avatarColor: 'bg-amber-600'
    };
    onLogin(adminUser);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Vui lòng nhập địa chỉ email học viên.');
      return;
    }

    const matched = availableStudents.find(s => s.email.toLowerCase() === trimmedEmail);
    if (!matched) {
      setError('Không tìm thấy tài khoản học viên với email này. Bạn có thể chọn học viên mẫu hoặc đăng ký mới.');
      return;
    }

    if (matched.hasPassword && matched.password && matched.password !== password) {
      setError('Mật khẩu chưa chính xác. Vui lòng kiểm tra lại.');
      return;
    }

    onLogin(matched);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Vui lòng nhập email quản trị viên.');
      return;
    }

    if (!isAuthorizedAdminEmail(trimmedEmail)) {
      setError('Email này chưa được phân quyền Quản trị viên trong hệ thống.');
      return;
    }

    const adminUser: UserProfile = {
      id: 'admin-auth',
      name: 'Quản trị viên',
      email: trimmedEmail,
      role: 'admin',
      level: 'Advanced',
      completedLessons: 0,
      totalLessons: 25,
      quizScore: 0,
      streakDays: 0,
      status: 'Hoạt động',
      joinedDate: '2026-01-01',
      avatarColor: 'bg-amber-600'
    };
    onLogin(adminUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedName) {
      setError('Vui lòng nhập đầy đủ họ tên và email.');
      return;
    }

    if (password.length < 4) {
      setError('Mật khẩu cần tối thiểu 4 ký tự.');
      return;
    }

    onSaveStudentPassword(trimmedEmail, password, trimmedName);

    const newStudent: UserProfile = {
      id: `std-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      role: 'student',
      level: 'Intermediate',
      completedLessons: 0,
      totalLessons: 25,
      quizScore: 0,
      streakDays: 1,
      status: 'Hoạt động',
      joinedDate: new Date().toISOString().split('T')[0],
      avatarColor: 'bg-teal-600',
      hasPassword: true,
      password
    };

    onLogin(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Đăng nhập vào LangMax
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-zinc-800 px-6 pt-2 bg-slate-50/50 dark:bg-zinc-950/40">
          <button
            onClick={() => { setTab('quick'); setError(null); }}
            className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-all ${
              tab === 'quick'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400'
            }`}
          >
            Dùng thử nhanh
          </button>
          <button
            onClick={() => { setTab('student-login'); setError(null); }}
            className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-all ${
              tab === 'student-login'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400'
            }`}
          >
            Học viên
          </button>
          <button
            onClick={() => { setTab('admin-login'); setError(null); }}
            className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-all ${
              tab === 'admin-login'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-all ${
              tab === 'register'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400'
            }`}
          >
            Tạo mới
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Quick Select */}
        {tab === 'quick' && (
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Chọn một hồ sơ có sẵn để trải nghiệm ngay mọi tính năng mà không cần nhập mật khẩu:
              </p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {availableStudents.slice(0, 4).map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectQuickStudent(student)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-left transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      student.avatarColor || 'bg-emerald-600'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {student.email} • {student.level}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Vào học &rarr;
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={handleAdminQuickLogin}
                className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Trải nghiệm ngay chế độ Quản trị viên (Admin)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Student Login */}
        {tab === 'student-login' && (
          <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyenvana@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Mật khẩu (nếu đã tạo)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              Đăng nhập Học viên
            </button>
          </form>
        )}

        {/* Tab 3: Admin Login */}
        {tab === 'admin-login' && (
          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
              Chỉ các tài khoản email được ủy quyền quản trị (như syxuanpq@gmail.com) mới có quyền truy cập công cụ soạn thảo, ngân hàng từ vựng và quản lý học viên.
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Email Quản trị viên
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="syxuanpq@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Mật khẩu Quản trị
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              Xác thực Quản trị viên
            </button>
          </form>
        )}

        {/* Tab 4: Register */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Họ và tên học viên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Minh Triết"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="minhtriet@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Mật khẩu đăng nhập
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 4 ký tự"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              Tạo tài khoản học ngay
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
