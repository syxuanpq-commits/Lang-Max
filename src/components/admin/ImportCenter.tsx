import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Code2, 
  ArrowRight,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  Download,
  UploadCloud,
  FileText,
  FileCheck
} from 'lucide-react';
import { Deck, Flashcard } from '../../types';
import { sanitizeCardData } from '../../utils/aiPedagogy';
import { 
  parseExcelBuffer, 
  parseCSVText, 
  downloadVocabularyTemplate 
} from '../../utils/excelParser';

interface ImportCenterProps {
  decks: Deck[];
  onImportFlashcards: (newCards: Flashcard[], targetDeckId: string) => void;
  onShowToast: (message?: string, type?: 'success' | 'error' | 'info') => void;
}

const SAMPLE_TEXT = `comprehensive | /ˌkɒm.prɪˈhen.sɪv/ | adj. | Toàn diện, bao hàm đầy đủ mọi khía cạnh | We offer a comprehensive training program for new engineers. | Chúng tôi cung cấp chương trình đào tạo toàn diện cho các kỹ sư mới.
spontaneous | /spɒnˈteɪ.ni.əs/ | adj. | Tự phát, ngẫu hứng, không lên kế hoạch trước | They had a spontaneous weekend trip to the seaside. | Họ đã có một chuyến du lịch ngẫu hứng cuối tuần ra bờ biển.
advocate | /ˈæd.və.keɪt/ | verb / noun | Người ủng hộ / Tán thành công khai | She is an advocate for educational equality. | Cô ấy là người ủng hộ bình đẳng giáo dục.`;

export function ImportCenter({ decks, onImportFlashcards, onShowToast }: ImportCenterProps) {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || 'deck-oxford-core');
  const [importMode, setImportMode] = useState<'excel' | 'text'>('excel');
  const [rawText, setRawText] = useState(SAMPLE_TEXT);
  const [previewCards, setPreviewCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload Handlers (Excel / CSV)
  const handleFileProcess = (file: File) => {
    setError(null);
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCsv = fileName.endsWith('.csv') || fileName.endsWith('.txt') || fileName.endsWith('.tsv');

    if (!isExcel && !isCsv) {
      setError('Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp .xlsx, .xls, hoặc .csv.');
      return;
    }

    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();

    if (isExcel) {
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const parsed = parseExcelBuffer(buffer, selectedDeckId);
          if (parsed.length === 0) {
            setError('Không thể trích xuất từ vựng từ tệp Excel. Vui lòng đảm bảo tệp có chứa cột Word và Meaning.');
            return;
          }
          setPreviewCards(parsed);
        } catch (err: any) {
          setError('Lỗi khi đọc tệp Excel: ' + (err.message || 'Tệp bị lỗi hoặc không đúng định dạng.'));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSV / TSV text parsing
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = parseCSVText(content, selectedDeckId);
          if (parsed.length === 0) {
            setError('Không thể trích xuất từ vựng từ tệp CSV. Vui lòng kiểm tra các dòng dữ liệu.');
            return;
          }
          setPreviewCards(parsed);
        } catch (err: any) {
          setError('Lỗi khi đọc tệp CSV: ' + (err.message || 'Định dạng dữ liệu không hợp lệ.'));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Text / Raw Parse Handler
  const handleParseText = () => {
    setError(null);
    const trimmed = rawText.trim();
    if (!trimmed) {
      setError('Vui lòng nhập hoặc dán nội dung từ vựng cần phân tích.');
      return;
    }

    const cards: Flashcard[] = [];

    // Check if JSON
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsedJson = JSON.parse(trimmed);
        if (Array.isArray(parsedJson)) {
          parsedJson.forEach(item => {
            cards.push(sanitizeCardData({ ...item, deckId: selectedDeckId }));
          });
        }
      } catch (e: any) {
        setError('Định dạng JSON chưa hợp lệ: ' + e.message);
        return;
      }
    } else if (trimmed.includes(',') && !trimmed.includes('|')) {
      // Auto-detect comma-separated CSV text pasted in textarea!
      const parsedCsv = parseCSVText(trimmed, selectedDeckId);
      if (parsedCsv.length > 0) {
        cards.push(...parsedCsv);
      }
    } else {
      // Parse Line by Line (Pipe separated: Word | Phonetic | PartOfSpeech | Vietnamese | ExampleEn | ExampleVi)
      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      lines.forEach((line, index) => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          const word = parts[0];
          const phonetic = parts[1] || '/.../';
          const partOfSpeech = parts[2] || 'adj.';
          const vietnamese = parts[3] || 'Định nghĩa của ' + word;
          const exampleEn = parts[4] || `Learning the word ${word} is important.`;
          const exampleVi = parts[5] || `Học từ ${word} rất quan trọng.`;

          cards.push(sanitizeCardData({
            id: `imported-${Date.now()}-${index}`,
            deckId: selectedDeckId,
            word,
            phonetic,
            partOfSpeech,
            definition: 'Meaning of ' + word,
            vietnamese,
            exampleEn,
            exampleVi,
            masteryLevel: 0
          }));
        }
      });
    }

    if (cards.length === 0) {
      setError('Không thể trích xuất từ vựng từ văn bản. Vui lòng kiểm tra định dạng phân cách bởi dấu phẩy (CSV) hoặc dấu gạch đứng (|).');
      return;
    }

    setPreviewCards(cards);
  };

  const handleConfirmImport = () => {
    if (previewCards.length === 0) return;
    onImportFlashcards(previewCards, selectedDeckId);
    setPreviewCards([]);
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setRawText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <span>Trung Tâm Nhập & Xử Lý Từ Vựng Excel, CSV & AI</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Nhập dữ liệu từ vựng hàng loạt từ file Excel (.xlsx, .xls), bảng tính CSV hoặc dán văn bản thô. Hệ thống sẽ tự động đồng bộ hóa sang Flashcard và câu hỏi trắc nghiệm Quiz.
        </p>
      </div>

      {/* Target Deck Selection & Template Downloads */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1.5 flex-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
            Học phần đích lưu từ vựng:
          </label>
          <select
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            className="w-full sm:max-w-md px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.title} ({deck.category} - {deck.level})
              </option>
            ))}
          </select>
        </div>

        {/* Template Downloads */}
        <div className="flex items-center space-x-2 self-start sm:self-end">
          <button
            onClick={() => downloadVocabularyTemplate('xlsx')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-xs"
            title="Tải file mẫu Excel chuẩn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Mẫu Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => downloadVocabularyTemplate('csv')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-200 transition-colors shadow-xs"
            title="Tải file mẫu CSV chuẩn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Mẫu CSV</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-700 space-x-6">
        <button
          onClick={() => { setImportMode('excel'); setError(null); }}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            importMode === 'excel'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Nhập tệp Excel & CSV (.xlsx, .xls, .csv)</span>
        </button>

        <button
          onClick={() => { setImportMode('text'); setError(null); }}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            importMode === 'text'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dán văn bản trực tiếp / JSON</span>
        </button>
      </div>

      {/* Mode 1: Excel & CSV File Upload */}
      {importMode === 'excel' && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`p-8 sm:p-10 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30'
                : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:border-amber-400 hover:bg-slate-50/50 dark:hover:bg-zinc-800'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.tsv,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Kéo thả file Excel hoặc CSV vào đây, hoặc <span className="text-amber-600 dark:text-amber-400 underline">chọn tệp từ máy tính</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Hỗ trợ định dạng: <strong>.xlsx, .xls, .csv</strong> (Tự động nhận diện cột: Word, Phonetic, Part of speech, Meaning, Example)
              </p>
            </div>
          </div>

          {/* Active Uploaded File Card */}
          {uploadedFileName && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-600 text-white">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {uploadedFileName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Dung lượng: {uploadedFileSize} • Đã trích xuất {previewCards.length} từ vựng
                  </p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline px-3 py-1 rounded-lg hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors"
              >
                Đổi tệp khác
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct Text & JSON Area */}
      {importMode === 'text' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Dán dữ liệu từ vựng (Hỗ trợ định dạng Pipe '|' hoặc Phẩy ',' CSV):
            </span>
            <button
              onClick={() => setRawText(SAMPLE_TEXT)}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nạp văn bản mẫu</span>
            </button>
          </div>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`resilient | /rɪˈzɪl.jənt/ | adj. | Kiên cường | She is resilient. | Cô ấy kiên cường.`}
            className="w-full p-3.5 rounded-2xl text-xs sm:text-sm font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex justify-end">
            <button
              onClick={handleParseText}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Phân tích & Xem trước ({previewCards.length > 0 ? previewCards.length : '0'})</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center space-x-2.5 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Table & Confirmation Button */}
      {previewCards.length > 0 && (
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800/80 border border-amber-300 dark:border-amber-700 space-y-4 shadow-lg animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Đã trích xuất thành công {previewCards.length} thẻ từ vựng</span>
            </div>
            <button
              onClick={handleConfirmImport}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
            >
              <span>Xác nhận nhập vào học phần</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-700/60 max-h-80 overflow-y-auto">
            {previewCards.map((card, idx) => (
              <div key={idx} className="py-2.5 flex items-start justify-between space-x-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{card.word}</span>
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{card.phonetic}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 font-semibold">
                      {card.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {card.vietnamese}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic">
                    "{card.exampleEn}"
                  </p>
                  {card.collocations && card.collocations.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {card.collocations.map((col, cIdx) => (
                        <span key={cIdx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400">
                          {col}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
