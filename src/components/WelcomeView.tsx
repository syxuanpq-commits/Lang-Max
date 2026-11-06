import React from 'react';
import { 
  Sparkles, 
  Layers, 
  BrainCircuit, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Smartphone 
} from 'lucide-react';

interface WelcomeViewProps {
  onOpenLogin: () => void;
  onQuickDemoLogin: (role: 'student' | 'admin') => void;
}

export function WelcomeView({ onOpenLogin, onQuickDemoLogin }: WelcomeViewProps) {
  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Hệ Thống Flashcard & Quiz Khảo Sát Năng Lực Toàn Diện</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Làm Chủ Từ Vựng Tiếng Anh <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
            Thông Minh & Ghi Nhớ Sâu
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Trải nghiệm phương pháp lặp lại ngắt quãng (Spaced Repetition), flashcard 2 mặt tương tác phát âm chuẩn bản xứ, câu hỏi trắc nghiệm tự động tạo và hệ thống thi đua xếp hạng thời gian thực.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onQuickDemoLogin('student')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Trải nghiệm Học viên (Demo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onQuickDemoLogin('admin')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Vào Bảng Quản trị (Admin)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/60 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Flashcard 3D & Phát Âm TTS
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Thẻ học tương tác lật 3D 2 mặt, phiên âm IPA, câu ví dụ song ngữ thực tế, cụm từ collocation và phát âm giọng Anh-Mỹ chân thực.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/60 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Quiz Tự Động Sinh Động
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Thuật toán tự động chuyển hóa ngân hàng từ vựng thành các dạng bài trắc nghiệm: nghĩa từ, điền từ vào ngữ cảnh và bài tập nghe phát âm.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/60 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Đa Thiết Bị & Khung Mô Phỏng
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Hỗ trợ chuyển đổi mượt mà giữa chế độ Laptop, iPad và Mobile trực quan ngay trên trình duyệt với dữ liệu đồng bộ tức thì.
          </p>
        </div>
      </div>

    </div>
  );
}
