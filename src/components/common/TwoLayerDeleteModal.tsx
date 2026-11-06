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
  Layers,
  Lock
} from 'lucide-react';
import { Flashcard, Deck } from '../../types';
import { RemovalScope, canConfirmRemoval } from '../../utils/cardRemoval';

interface TwoLayerDeleteModalProps {
  card: Flashcard;
  decks: Deck[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: RemovalScope) => void;
}

export function TwoLayerDeleteModal({
  card,
  decks,
  isOpen,
  onClose,
  onConfirm
}: TwoLayerDeleteModalProps) {
  const [scope, setScope] = useState<RemovalScope>('unbind');
  const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  if (!isOpen) return null;

  const currentDeck = decks.find(d => d.id === card.deckId);
  const deckTitle = currentDeck ? currentDeck.title : 'Chưa phân loại';

  const isLayer2Valid = canConfirmRemoval(
    scope,
    card.word,
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
                <span>Gỡ Thẻ Từ Vựng Qua 2 Lớp</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 dark:bg-rose-900/70 text-rose-700 dark:text-rose-300">
                  2-Layer Security
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Xác thực 2 bước để bảo vệ tiến độ học tập và dữ liệu học phần
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
          {/* Card Info Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base text-slate-900 dark:text-white">
                  {card.word}
                </span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  {card.phonetic}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold">
                  {card.partOfSpeech}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-zinc-300 mt-0.5">
                {card.vietnamese}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Học phần:</span>
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate max-w-[140px] block">
                {deckTitle}
              </span>
            </div>
          </div>

          {/* Lớp 1: Chọn Phạm Vi Gỡ */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>Lớp 1: Chọn hình thức gỡ thẻ</span>
              </label>
              <span className="text-[11px] text-slate-400">Bắt buộc</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Gỡ khỏi học phần (Unbind) */}
              <button
                type="button"
                onClick={() => {
                  setScope('unbind');
                  setIsConfirmedCheckbox(false);
                  setConfirmationInput('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  scope === 'unbind'
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
                      Gỡ khỏi học phần
                    </span>
                  </div>
                  {scope === 'unbind' && (
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Đưa thẻ vào <strong>Kho lưu trữ chưa phân loại</strong>. Dữ liệu từ vựng và tiến độ học tập được bảo toàn an toàn.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                  Được khuyến nghị
                </span>
              </button>

              {/* Option B: Xóa vĩnh viễn (Permanent Delete) */}
              <button
                type="button"
                onClick={() => {
                  setScope('permanent');
                  setIsConfirmedCheckbox(false);
                  setConfirmationInput('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  scope === 'permanent'
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
                      Xóa vĩnh viễn
                    </span>
                  </div>
                  {scope === 'permanent' && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Xóa hoàn toàn khỏi cơ sở dữ liệu và tự động làm mới bộ đề thi Quiz. Thao tác này <strong>không thể hoàn tác</strong>!
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                  Nguy hiểm cao
                </span>
              </button>
            </div>
          </div>

          {/* Lớp 2: Xác Thực Bảo Mật */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                2
              </span>
              <span>Lớp 2: Xác nhận bảo vệ bảo mật</span>
            </label>

            {scope === 'unbind' ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfirmedCheckbox}
                    onChange={(e) => setIsConfirmedCheckbox(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-zinc-200 font-medium leading-relaxed">
                    Tôi xác nhận muốn gỡ thẻ <strong>"{card.word}"</strong> khỏi học phần <strong>"{deckTitle}"</strong> và lưu thẻ vào kho chưa phân loại.
                  </span>
                </label>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 pl-6.5">
                  Thẻ sẽ không xuất hiện trong các bài luyện tập của học phần này, nhưng vẫn có thể xem lại trong kho dữ liệu tổng.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 space-y-3">
                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Cảnh báo bảo mật: Để tránh xóa nhầm, hãy nhập từ khóa xác thực bên dưới:</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-300 mb-1">
                    <span>Nhập từ vựng: <strong className="font-mono text-rose-600 dark:text-rose-400 select-all font-bold">{card.word}</strong></span>
                    {isLayer2Valid ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Khớp từ khóa
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium">Chưa khớp</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    placeholder={`Nhập chính xác "${card.word}"...`}
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
                : scope === 'unbind'
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
            }`}
          >
            {!isLayer2Valid && <Lock className="w-3.5 h-3.5" />}
            {isLayer2Valid && (scope === 'unbind' ? <Archive className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />)}
            <span>
              {scope === 'unbind' ? 'Xác nhận gỡ thẻ (Lớp 2)' : 'Xóa vĩnh viễn thẻ (Lớp 2)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
