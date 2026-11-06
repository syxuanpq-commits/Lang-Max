import React, { useState } from 'react';
import { 
  CheckSquare, 
  RotateCw, 
  Plus, 
  Trash2, 
  Search, 
  Volume2, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  Sparkles,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { Deck, Flashcard, QuizQuestion } from '../../types';
import { generateQuizQuestions } from '../../utils/quizGenerator';
import { speakWord } from '../../utils/audio';
import { exportQuizQuestionsToExcel } from '../../utils/excelParser';

interface QuizManagementProps {
  quizQuestions: QuizQuestion[];
  decks: Deck[];
  flashcards: Flashcard[];
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
  onShowToast: (message?: string, type?: 'success' | 'error' | 'info') => void;
}

export function QuizManagement({
  quizQuestions,
  decks,
  flashcards,
  onUpdateQuestions,
  onShowToast
}: QuizManagementProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Question Form
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<'multiple-choice' | 'fill-blank' | 'listening'>('multiple-choice');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('');
  const [explanation, setExplanation] = useState('');

  const filtered = quizQuestions.filter(q => {
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return q.question.toLowerCase().includes(s) || q.correctAnswer.toLowerCase().includes(s);
    }
    return true;
  });

  const handleRegenerateAll = () => {
    const fresh = generateQuizQuestions(flashcards);
    onUpdateQuestions(fresh);
    onShowToast(`Đã tự động tái tạo ${fresh.length} câu hỏi trắc nghiệm từ ngân hàng từ vựng hiện tại!`, 'success');
  };

  const handleExport = (format: 'xlsx' | 'csv' = 'xlsx') => {
    const listToExport = filtered.length > 0 ? filtered : quizQuestions;
    if (listToExport.length === 0) {
      onShowToast('Chưa có câu hỏi trắc nghiệm nào để xuất file!', 'error');
      return;
    }
    exportQuizQuestionsToExcel(listToExport, format);
    onShowToast(`Đã xuất ${listToExport.length} câu hỏi trắc nghiệm ra file ${format.toUpperCase()} thành công!`, 'success');
  };

  const handleDelete = (id: string) => {
    const updated = quizQuestions.filter(q => q.id !== id);
    onUpdateQuestions(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optA.trim() || !optB.trim() || !correct.trim()) return;

    const options = [optA.trim(), optB.trim()];
    if (optC.trim()) options.push(optC.trim());
    if (optD.trim()) options.push(optD.trim());

    const newQ: QuizQuestion = {
      id: `custom-q-${Date.now()}`,
      type: qType,
      question: qText.trim(),
      options,
      correctAnswer: correct.trim(),
      explanation: explanation.trim() || 'Đáp án đúng là: ' + correct.trim()
    };

    onUpdateQuestions([newQ, ...quizQuestions]);
    setIsAddOpen(false);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrect('');
    setExplanation('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 flex flex-col h-full justify-between overflow-hidden">
      {/* Header & Regenerate action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>Ngân Hàng Đề Thi Trắc Nghiệm ({quizQuestions.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Kiểm tra và quản lý kho câu hỏi luyện tập tự động sinh ra từ ngân hàng từ vựng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleExport('xlsx')}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            title="Xuất danh sách câu hỏi trắc nghiệm ra file Excel (.xlsx)"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file Excel</span>
          </button>

          <button
            onClick={handleRegenerateAll}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-zinc-700 transition-all"
            title="Đồng bộ lại đề thi từ danh sách từ vựng hiện tại"
          >
            <RotateCw className="w-4 h-4 text-amber-600" />
            <span>Tái tạo từ Flashcard</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu hỏi</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm câu hỏi hoặc đáp án..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">Tất cả dạng bài</option>
          <option value="multiple-choice">Trắc nghiệm nghĩa từ</option>
          <option value="fill-blank">Điền từ vào chỗ trống</option>
          <option value="listening">Luyện nghe phát âm</option>
        </select>
      </div>

      {/* Questions list */}
      <div className="space-y-3 max-h-[280px] sm:max-h-[360px] overflow-y-auto no-scrollbar pr-1">
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {q.type === 'multiple-choice' ? 'Trắc nghiệm nghĩa' : q.type === 'fill-blank' ? 'Điền khuyết' : 'Luyện nghe'}
              </span>

              <div className="flex items-center space-x-2">
                {q.audioText && (
                  <button
                    onClick={() => speakWord(q.audioText!)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Nghe audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  title="Xóa câu hỏi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-pre-line">
              {q.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {q.options.map((opt, oIdx) => (
                <div
                  key={oIdx}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                    opt === q.correctAnswer
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                  {opt === q.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              ))}
            </div>

            {q.explanation && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 italic pt-1 border-t border-slate-100 dark:border-zinc-700/50">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add Question */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-amber-600" />
                <span>Thêm Câu Hỏi Trắc Nghiệm Mới</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Dạng câu hỏi
                </label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                >
                  <option value="multiple-choice">Trắc nghiệm nghĩa từ</option>
                  <option value="fill-blank">Điền từ vào chỗ trống</option>
                  <option value="listening">Luyện nghe phát âm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Nội dung câu hỏi
                </label>
                <textarea
                  rows={2}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Ví dụ: Nghĩa của từ 'ubiquitous' là gì?"
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Lựa chọn A
                  </label>
                  <input
                    type="text"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Lựa chọn B
                  </label>
                  <input
                    type="text"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Lựa chọn C
                  </label>
                  <input
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Lựa chọn D
                  </label>
                  <input
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Đáp án chính xác (phải trùng khớp chính xác 1 trong các lựa chọn trên)
                </label>
                <input
                  type="text"
                  value={correct}
                  onChange={(e) => setCorrect(e.target.value)}
                  placeholder="Nhập nội dung của đáp án đúng"
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Giải thích đáp án
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Giải thích ngắn gọn cho học viên..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
                >
                  Thêm câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
