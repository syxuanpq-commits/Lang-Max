import React, { useState, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Clock, 
  BookOpen, 
  Layers, 
  ShieldAlert
} from 'lucide-react';
import { Deck, Flashcard } from '../../types';
import { speakWord } from '../../utils/audio';
import { TwoLayerDeleteModal } from '../common/TwoLayerDeleteModal';
import { RemovalScope } from '../../utils/cardRemoval';

interface FlashcardViewProps {
  decks: Deck[];
  flashcards: Flashcard[];
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onUpdateFlashcard: (card: Flashcard) => void;
  onDeleteFlashcard?: (cardId: string) => void;
  onShowToast: (message?: string, type?: 'success' | 'error' | 'info') => void;
}

export function FlashcardView({
  decks,
  flashcards,
  selectedDeckId,
  onSelectDeck,
  onUpdateFlashcard,
  onDeleteFlashcard,
  onShowToast
}: FlashcardViewProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter cards by selected deck
  const filteredCards = selectedDeckId === 'all'
    ? flashcards
    : flashcards.filter(c => c.deckId === selectedDeckId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset index if filtered deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedDeckId]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }, [filteredCards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentCard) {
      speakWord(currentCard.word);
    }
  };

  const handleSetMastery = (level: number) => {
    if (!currentCard) return;
    const updated: Flashcard = {
      ...currentCard,
      masteryLevel: level,
      lastReviewed: new Date().toISOString()
    };
    onUpdateFlashcard(updated);
    // Smoothly progress to next card
    handleNext();
  };

  const handleConfirmRemoval = (scope: RemovalScope) => {
    if (!currentCard) return;
    if (scope === 'unbind') {
      onUpdateFlashcard({ ...currentCard, deckId: 'unassigned' });
      onShowToast(`Đã gỡ thẻ "${currentCard.word}" khỏi học phần và chuyển vào kho chưa phân loại.`, 'info');
    } else {
      if (onDeleteFlashcard) {
        onDeleteFlashcard(currentCard.id);
        onShowToast(`Đã xóa vĩnh viễn thẻ "${currentCard.word}" qua xác thực 2 lớp!`, 'success');
      } else {
        onUpdateFlashcard({ ...currentCard, deckId: 'unassigned' });
        onShowToast(`Đã gỡ thẻ "${currentCard.word}" khỏi học phần.`, 'info');
      }
    }
    setIsDeleteModalOpen(false);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (currentCard) speakWord(currentCard.word);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard]);

  if (!currentCard || filteredCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Chưa có thẻ từ vựng trong học phần này
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Vui lòng chọn học phần khác hoặc chuyển sang tài khoản Admin để nhập thêm từ vựng.
        </p>
        <button
          onClick={() => onSelectDeck('all')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
        >
          Xem tất cả từ vựng
        </button>
      </div>
    );
  }

  // Mastery status stats for the current deck
  const masteredCount = filteredCards.filter(c => c.masteryLevel === 2).length;
  const learningCount = filteredCards.filter(c => c.masteryLevel === 1).length;
  const progressPercent = Math.round(((currentIndex + 1) / filteredCards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-3 select-none">
      {/* Restructured Top Panel: Deck Picker & Cards Viewed Counter - Compacted */}
      <div className="bg-white dark:bg-zinc-800/90 p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 shadow-xs space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          {/* Deck Dropdown */}
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <select
              value={selectedDeckId}
              onChange={(e) => onSelectDeck(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-zinc-700/60 border border-slate-200 dark:border-zinc-600 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-zinc-100"
            >
              <option value="all">Tất cả học phần ({flashcards.length} từ)</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.title} ({flashcards.filter(c => c.deckId === deck.id).length} từ)
                </option>
              ))}
            </select>
          </div>

          {/* Cards Viewed Counter (Selector Focus) */}
          <div className="flex items-center justify-between sm:justify-end space-x-1.5 sm:space-x-2 text-[11px]">
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60">
              <span className="font-medium text-slate-500 dark:text-zinc-400">Đã xem:</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-300">
                {currentIndex + 1} / {filteredCards.length} thẻ
              </span>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold">({progressPercent}%)</span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" title="Số từ đã thuộc">
                Thuộc: {masteredCount}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-zinc-700/80 rounded-full h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Interactive Flip Flashcard - Calibrated Height for Single Screen */}
      <div 
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[260px] sm:max-h-[320px] md:max-h-[340px] cursor-pointer perspective-1000 group"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-md border border-slate-200/90 dark:border-zinc-700/80 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-white dark:bg-zinc-800/95 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                {currentCard.partOfSpeech}
              </span>

              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  currentCard.masteryLevel === 2
                    ? 'bg-emerald-500'
                    : currentCard.masteryLevel === 1
                    ? 'bg-amber-500'
                    : 'bg-slate-300 dark:bg-zinc-600'
                }`} />
                <span className="text-[11px] text-slate-400">
                  {currentCard.masteryLevel === 2 ? 'Đã thuộc' : currentCard.masteryLevel === 1 ? 'Đang học' : 'Chưa nhớ'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
                  title="Gỡ thẻ qua 2 lớp bảo vệ"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Word Center */}
            <div className="text-center my-auto space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentCard.word}
              </h2>

              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                  {currentCard.phonetic}
                </span>
                <button
                  onClick={handlePlayAudio}
                  className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95"
                  title="Nghe phát âm chuẩn (Phím A)"
                  aria-label="Phát âm từ vựng"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hint & Flip reminder */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 pt-1.5 border-t border-slate-100 dark:border-zinc-700/60">
              <span className="flex items-center space-x-1">
                <RotateCw className="w-3 h-3" />
                <span>Nhấn vào thẻ hoặc phím Space để lật mặt thẻ</span>
              </span>
              <span className="hidden sm:inline">Phím tắt: &larr; | &rarr;</span>
            </div>
          </div>

          {/* Card Back (Flipped) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-slate-900 text-white p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between shrink-0 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-indigo-900/60 text-indigo-300 text-[11px] font-semibold border border-indigo-700/60">
                {currentCard.word} • {currentCard.partOfSpeech}
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1 rounded-full bg-white/10 text-white/70 hover:text-rose-400 hover:bg-white/20 transition-all"
                  title="Gỡ thẻ qua 2 lớp bảo vệ"
                >
                  <ShieldAlert className="w-3 h-3" />
                </button>
                <button
                  onClick={handlePlayAudio}
                  className="p-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  title="Nghe phát âm"
                  aria-label="Nghe phát âm"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Definition & Examples */}
            <div className="my-auto space-y-1.5 text-left">
              <div>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Nghĩa Tiếng Việt
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {currentCard.vietnamese}
                </h3>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Định nghĩa tiếng Anh
                </span>
                <p className="text-[11px] text-slate-300 italic leading-snug">
                  "{currentCard.definition}"
                </p>
              </div>

              {currentCard.exampleEn && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                  <p className="text-[11px] text-indigo-200 font-medium">
                    {currentCard.exampleEn}
                  </p>
                  {currentCard.exampleVi && (
                    <p className="text-[10px] text-slate-400">
                      {currentCard.exampleVi}
                    </p>
                  )}
                </div>
              )}

              {currentCard.collocations && currentCard.collocations.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Collocations:</span>
                  {currentCard.collocations.map((col, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                      {col}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-1 border-t border-white/10">
              Nhấn lần nữa để lật lại mặt trước
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Level Buttons removed as requested */}

      {/* Navigation Toolbar: "Trước" & "Tiếp" */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-xs"
          title="Chuyển sang từ vựng phía trước (Phím mũi tên trái)"
        >
          <ChevronLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Trước</span>
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-bold hover:bg-indigo-100 transition-colors"
          title="Lật thẻ từ vựng (Phím Space)"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Lật thẻ</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
          title="Chuyển sang từ vựng tiếp theo (Phím mũi tên phải)"
        >
          <span>Tiếp</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Two-Layer Removal Protected Modal */}
      {currentCard && (
        <TwoLayerDeleteModal
          card={currentCard}
          decks={decks}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmRemoval}
        />
      )}
    </div>
  );
}
