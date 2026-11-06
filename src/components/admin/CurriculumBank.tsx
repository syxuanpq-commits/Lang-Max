import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Layers, 
  Search, 
  Volume2, 
  X, 
  Check, 
  Tag, 
  BarChart2,
  ShieldAlert
} from 'lucide-react';
import { Deck, Flashcard } from '../../types';
import { speakWord } from '../../utils/audio';
import { TwoLayerDeleteModal } from '../common/TwoLayerDeleteModal';
import { TwoLayerDeckDeleteModal } from '../common/TwoLayerDeckDeleteModal';
import { RemovalScope } from '../../utils/cardRemoval';
import { DeckRemovalScope } from '../../utils/deckRemoval';

interface CurriculumBankProps {
  decks: Deck[];
  flashcards: Flashcard[];
  onCreateDeck: (newDeck: Deck) => void;
  onDeleteDeck: (deckId: string, preserveCards?: boolean) => void;
  onDeleteFlashcard: (cardId: string) => void;
  onUpdateFlashcard?: (card: Flashcard) => void;
  onShowToast: (message?: string, type?: 'success' | 'error' | 'info') => void;
}

export function CurriculumBank({
  decks,
  flashcards,
  onCreateDeck,
  onDeleteDeck,
  onDeleteFlashcard,
  onUpdateFlashcard,
  onShowToast
}: CurriculumBankProps) {
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isNewDeckOpen, setIsNewDeckOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);

  // New Deck Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [category, setCategory] = useState('Chuyên đề nâng cao');

  const filteredCards = flashcards.filter(c => {
    if (selectedDeckId !== 'all' && c.deckId !== selectedDeckId) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.word.toLowerCase().includes(q) || c.vietnamese.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Học phần bổ sung được tạo bởi Quản trị viên.',
      level,
      category,
      icon: 'layers',
      cardCount: 0
    };

    onCreateDeck(newDeck);
    setIsNewDeckOpen(false);
    setTitle('');
    setDescription('');
    setSelectedDeckId(newDeck.id);
  };

  const handleConfirmRemoval = (scope: RemovalScope) => {
    if (!cardToDelete) return;
    if (scope === 'unbind') {
      if (onUpdateFlashcard) {
        onUpdateFlashcard({ ...cardToDelete, deckId: 'unassigned' });
        onShowToast(`Đã gỡ thẻ "${cardToDelete.word}" khỏi học phần và chuyển vào kho chưa phân loại.`, 'info');
      } else {
        onDeleteFlashcard(cardToDelete.id);
        onShowToast(`Đã gỡ thẻ "${cardToDelete.word}" khỏi học phần.`, 'info');
      }
    } else {
      onDeleteFlashcard(cardToDelete.id);
      onShowToast(`Đã xóa vĩnh viễn thẻ "${cardToDelete.word}" qua xác thực 2 lớp!`, 'success');
    }
    setCardToDelete(null);
  };

  const handleConfirmDeckRemoval = (scope: DeckRemovalScope) => {
    if (!deckToDelete) return;
    const preserveCards = scope === 'archive_cards';
    onDeleteDeck(deckToDelete.id, preserveCards);
    if (selectedDeckId === deckToDelete.id) {
      setSelectedDeckId('all');
    }
    if (preserveCards) {
      onShowToast(`Đã gỡ học phần "${deckToDelete.title}" và lưu toàn bộ từ vựng vào kho chưa phân loại.`, 'info');
    } else {
      onShowToast(`Đã xóa toàn diện học phần "${deckToDelete.title}" và toàn bộ từ vựng qua xác thực 2 lớp!`, 'success');
    }
    setDeckToDelete(null);
  };

  const unassignedCount = flashcards.filter(c => c.deckId === 'unassigned').length;

  return (
    <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 flex flex-col h-full justify-between overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>Ngân Hàng Học Phần & Quản Lý Từ Vựng</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Quản lý các bộ giáo trình từ vựng, thêm học phần chuyên đề mới và chỉnh sửa danh mục thẻ.
          </p>
        </div>

        <button
          onClick={() => setIsNewDeckOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo học phần mới</span>
        </button>
      </div>

      {/* Decks Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setSelectedDeckId('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedDeckId === 'all'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs'
              : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Tất cả từ vựng</span>
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
            {flashcards.length} thẻ
          </p>
        </div>



        {decks.map((deck) => {
          const count = flashcards.filter(c => c.deckId === deck.id).length;
          const isSelected = selectedDeckId === deck.id;

          return (
            <div
              key={deck.id}
              onClick={() => setSelectedDeckId(deck.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs'
                  : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between pr-5">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 line-clamp-1">
                  {deck.title}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                {count} thẻ
              </p>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                <span>{deck.level}</span>
                <span>{deck.category}</span>
              </div>

              {/* Delete deck button with 2-layer protection */}
              {decks.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeckToDelete(deck);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-700/80 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-80 hover:opacity-100 transition-all"
                  title="Gỡ học phần qua 2 lớp bảo vệ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Search & Flashcards Table */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lọc từ vựng trong học phần đang chọn..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="bg-white dark:bg-zinc-800/80 rounded-3xl border border-slate-200/80 dark:border-zinc-700/60 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-zinc-700/50 max-h-[220px] sm:max-h-[300px] overflow-y-auto no-scrollbar">
            {filteredCards.map((card) => (
              <div key={card.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-zinc-700/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => speakWord(card.word)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {card.word}
                      </h4>
                      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                        {card.phonetic}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-700 text-slate-500">
                        {card.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium">
                      {card.vietnamese}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCardToDelete(card)}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
                    title="Gỡ thẻ qua 2 lớp bảo vệ"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Gỡ thẻ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Create New Deck */}
      {isNewDeckOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Tạo Bộ Từ Vựng Học Phần Mới</span>
              </h3>
              <button onClick={() => setIsNewDeckOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Tên Học Phần / Khóa học
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Du Học & Định Cư Quốc Tế"
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả mục tiêu của bộ từ vựng này..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Cấp độ
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Beginner">Beginner (A1-A2)</option>
                    <option value="Intermediate">Intermediate (B1-B2)</option>
                    <option value="Advanced">Advanced (C1-C2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Chuyên mục
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Giao tiếp / Học thuật..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDeckOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
                >
                  Tạo học phần
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Layer Removal Protected Modal */}
      {cardToDelete && (
        <TwoLayerDeleteModal
          card={cardToDelete}
          decks={decks}
          isOpen={cardToDelete !== null}
          onClose={() => setCardToDelete(null)}
          onConfirm={handleConfirmRemoval}
        />
      )}

      {/* Two-Layer Deck Removal Protected Modal */}
      {deckToDelete && (
        <TwoLayerDeckDeleteModal
          deck={deckToDelete}
          cards={flashcards}
          isOpen={deckToDelete !== null}
          onClose={() => setDeckToDelete(null)}
          onConfirm={handleConfirmDeckRemoval}
        />
      )}
    </div>
  );
}
