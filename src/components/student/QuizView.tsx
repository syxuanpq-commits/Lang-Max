import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  BrainCircuit, 
  Sparkles, 
  Flame, 
  HelpCircle 
} from 'lucide-react';
import { QuizQuestion, UserProfile } from '../../types';
import { speakWord, playSuccessSound, playErrorSound } from '../../utils/audio';

interface QuizViewProps {
  questions: QuizQuestion[];
  currentUser: UserProfile;
  onUpdateScore: (earnedPoints: number) => void;
  onShowToast: (message?: string, type?: 'success' | 'error' | 'info') => void;
}

export function QuizView({
  questions,
  currentUser,
  onUpdateScore,
  onShowToast
}: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [sessionSize, setSessionSize] = useState<number>(questions.length > 0 ? questions.length : 10);

  // Take all available questions or user's full bank session
  const sessionQuestions = questions.slice(0, sessionSize > 0 ? sessionSize : questions.length);
  const currentQuestion = sessionQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      playSuccessSound();
      const points = 20 + combo * 5;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setCombo(prev => prev + 1);
    } else {
      playErrorSound();
      setCombo(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      // Award total score to user profile
      onUpdateScore(score);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setCombo(0);
    setIsCompleted(false);
  };

  if (!currentQuestion || sessionQuestions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 mx-auto flex items-center justify-center">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Chưa có câu hỏi trắc nghiệm
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Hệ thống sẽ tự động tạo đề thi từ các thẻ từ vựng khi bạn hoặc Admin nhập bài học mới.
        </p>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    const accuracy = Math.round((correctCount / sessionQuestions.length) * 100);
    return (
      <div className="max-w-md mx-auto py-6 space-y-6 text-center animate-in zoom-in-95 duration-300">
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/60 shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Hoàn Thành Bài Quiz! 🎉
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Bạn đã hoàn thành xuất sắc đợt kiểm tra từ vựng hôm nay.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-700/50">
            <div>
              <p className="text-[11px] text-slate-400">Điểm thưởng</p>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">+{score} XP</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Đúng</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {correctCount}/{sessionQuestions.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Độ chính xác</p>
              <p className="text-xl font-black text-amber-500">{accuracy}%</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử thách lại vòng thi khác</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3 select-none">
      {/* Quiz Progress & Score Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white dark:bg-zinc-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-700/60 shadow-xs">
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
            Câu {currentIndex + 1} / {sessionQuestions.length}
          </span>
          <div className="w-28 sm:w-36 bg-slate-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          {/* Session Size Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 dark:text-zinc-400 font-medium">Số câu:</span>
            <select
              value={sessionSize}
              onChange={(e) => {
                setSessionSize(Number(e.target.value));
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className="bg-slate-50 dark:bg-zinc-700/80 border border-slate-200 dark:border-zinc-600 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value={10}>10 câu</option>
              <option value={20}>20 câu</option>
              <option value={50}>50 câu</option>
              <option value={questions.length}>Tất cả ({questions.length} câu)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {combo > 1 && (
              <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-300 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>x{combo}</span>
              </div>
            )}

            <div className="flex items-center space-x-1 font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{score} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/60 shadow-md space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
              {currentQuestion.type === 'multiple-choice'
                ? 'Nghĩa từ vựng'
                : currentQuestion.type === 'fill-blank'
                ? 'Điền từ vào ngữ cảnh'
                : 'Nghe phát âm'}
            </span>

            {currentQuestion.audioText && (
              <button
                onClick={() => speakWord(currentQuestion.audioText!)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors"
                title="Nghe lại phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe âm thanh</span>
              </button>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentQuestion.options.map((option, idx) => {
            let btnStyle = 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-indigo-400 dark:hover:border-indigo-500';

            if (isAnswered) {
              if (option === currentQuestion.correctAnswer) {
                btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
              } else if (option === selectedOption) {
                btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-bold';
              } else {
                btnStyle = 'border-slate-200 dark:border-zinc-800 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 text-left text-xs font-semibold transition-all transform active:scale-98 ${btnStyle}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && option === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswered && (
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-700/60 space-y-3 animate-in fade-in">
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 space-y-0.5 text-left">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                Giải thích & Ngữ cảnh
              </span>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {currentQuestion.explanation}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>{currentIndex + 1 < sessionQuestions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
