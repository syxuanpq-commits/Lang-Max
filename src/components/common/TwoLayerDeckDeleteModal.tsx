/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  BookOpen,
  Lock,
  Layers
} from 'lucide-react';
import { Deck, Flashcard } from '../../types';
import { DeckRemovalScope, canConfirmDeckRemoval } from '../../utils/deckRemoval';

interface TwoLayerDeckDeleteModalProps {
  deck: Deck;
  cards: Flashcard[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: DeckRemovalScope) => void;
}

export function TwoLayerDeckDeleteModal({
  deck,
  cards,
  isOpen,
  onClose,
  onConfirm
}: TwoLayerDeckDeleteModalProps) {
  const [scope, setScope] = useState<DeckRemovalScope>('archive_cards');
  const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  if (!isOpen) return null;

  const deckCards = cards.filter(c => c.deckId === deck.id);
  const cardCount = deckCards.length;

  const isLayer2Valid = canConfirmDeckRemoval(
    scope,
    deck.title,
    isConfirmedCheckbox,
    confirmationInput
  );

  const handleConfirmAction = () => {
    if (!isLayer2Valid) return;
    onConfirm(scope);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div 
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Gỡ Học Phần Qua 2 Lớp</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 dark:bg-rose-900/70 text-rose-700 dark:text-rose-300">
                  2-Layer Security
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Bảo vệ giáo trình và số phận {cardCount} từ vựng thuộc học phần
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Deck Info Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {deck.title}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-zinc-400">
                <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-zinc-700 rounded text-slate-700 dark:text-zinc-300 font-semibold">
                  {deck.level}
                </span>
                <span>•</span>
                <span>{deck.category}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-1 rounded-xl">
                {cardCount} thẻ từ vựng
              </span>
            </div>
          </div>

          {/* Lớp 1: Chọn Hình Thức Gỡ Học Phần */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>Lớp 1: Chọn hình thức gỡ học phần</span>
              </label>
              <span className="text-[11px] text-slate-400">Bắt buộc</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Lưu từ vựng vào kho lưu */}
              <button
                type="button"
                onClick={() => {
                  setScope('archive_cards');
                  setIsConfirmedCheckbox(false);
                  setConfirmationInput('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  scope === 'archive_cards'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
                      <Archive className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Giữ lại từ vựng
                    </span>
                  </div>
                  {scope === 'archive_cards' && (
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Gỡ học phần nhưng lưu toàn bộ <strong>{cardCount} thẻ từ vựng</strong> vào Kho chưa phân loại để bảo toàn tiến độ học tập.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                  Được khuyến nghị
                </span>
              </button>

              {/* Option B: Xóa toàn diện học phần & từ vựng */}
              <button
                type="button"
                onClick={() => {
                  setScope('purge_all');
                  setIsConfirmedCheckbox(false);
                  setConfirmationInput('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  scope === 'purge_all'
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Xóa toàn diện
                    </span>
                  </div>
                  {scope === 'purge_all' && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Xóa vĩnh viễn học phần <strong>VÀ toàn bộ {cardCount} thẻ từ vựng</strong> cùng mọi câu hỏi Quiz tương ứng. Không thể khôi phục!
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                  Nguy hiểm cực độ
                </span>
              </button>
            </div>
          </div>

          {/* Lớp 2: Cổng Xác Thực Bảo Mật */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                2
              </span>
              <span>Lớp 2: Cổng xác nhận an ninh nghiêm ngặt</span>
            </label>

            {scope === 'archive_cards' ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfirmedCheckbox}
                    onChange={(e) => setIsConfirmedCheckbox(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-zinc-200 font-medium leading-relaxed">
                    Tôi xác nhận muốn gỡ học phần <strong>"{deck.title}"</strong> và giữ lại toàn bộ <strong>{cardCount} thẻ từ vựng</strong> trong kho lưu trữ chưa phân loại.
                  </span>
                </label>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 pl-6.5">
                  Các thẻ từ vựng vẫn sẽ tồn tại và bạn có thể phân bổ vào học phần khác bất cứ lúc nào.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 space-y-3">
                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Cảnh báo nguy hiểm: Bạn sắp xóa học phần cùng toàn bộ {cardCount} thẻ từ vựng!</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-300 mb-1">
                    <span>Nhập chính xác tên học phần:</span>
                    {isLayer2Valid ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Khớp tên học phần
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium">Chưa khớp</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    placeholder={`Nhập "${deck.title}" để xác nhận...`}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-800 border transition-all ${
                      isLayer2Valid 
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 dark:text-white'
                        : 'border-rose-300 dark:border-rose-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            disabled={!isLayer2Valid}
            onClick={handleConfirmAction}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all ${
              !isLayer2Valid
                ? 'opacity-40 cursor-not-allowed bg-slate-300 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400'
                : scope === 'archive_cards'
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
            }`}
          >
            {!isLayer2Valid && <Lock className="w-3.5 h-3.5" />}
            {isLayer2Valid && (scope === 'archive_cards' ? <Archive className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />)}
            <span>
              {scope === 'archive_cards' ? 'Xác nhận gỡ học phần (Lớp 2)' : 'Xóa toàn diện học phần (Lớp 2)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
