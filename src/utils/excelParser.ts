import * as XLSX from 'xlsx';
import { Flashcard, QuizQuestion } from '../types';
import { sanitizeCardData } from './aiPedagogy';

/**
 * Normalizes header keys to standard Flashcard fields
 */
function normalizeKey(rawKey: string): string {
  const k = rawKey.toLowerCase().trim().replace(/[\s_-]+/g, '');
  if (['word', 'tu', 'tuvung', 'vocabulary', 'term', 'en'].includes(k)) return 'word';
  if (['phonetic', 'phienam', 'ipa', 'pronunciation', 'sound'].includes(k)) return 'phonetic';
  if (['partofspeech', 'loaitu', 'tuloai', 'pos', 'type'].includes(k)) return 'partOfSpeech';
  if (['vietnamese', 'nghia', 'nghiatiengviet', 'meaning', 'translation', 'dinhnghia', 'vi'].includes(k)) return 'vietnamese';
  if (['definition', 'dinhnghiatienganh', 'englishdefinition'].includes(k)) return 'definition';
  if (['exampleen', 'example', 'vidu', 'vidutienganh', 'sentence'].includes(k)) return 'exampleEn';
  if (['examplevi', 'dichvidu', 'vidutiengviet', 'sentencesvi', 'translatorexample'].includes(k)) return 'exampleVi';
  if (['collocations', 'collocation', 'cumtu'].includes(k)) return 'collocations';
  return k;
}

/**
 * Parses CSV text content into Flashcard array
 */
export function parseCSVText(csvContent: string, targetDeckId: string): Flashcard[] {
  if (!csvContent || !csvContent.trim()) return [];

  // Parse using SheetJS for resilient handling of quotes, multiline cells, commas, semicolons
  const workbook = XLSX.read(csvContent, { type: 'string' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  return convertMatrixToFlashcards(rawRows, targetDeckId);
}

/**
 * Parses binary or ArrayBuffer Excel (.xlsx, .xls) data into Flashcard array
 */
export function parseExcelBuffer(buffer: ArrayBuffer, targetDeckId: string): Flashcard[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  return convertMatrixToFlashcards(rawRows, targetDeckId);
}

/**
 * Converts a 2D sheet matrix to Flashcard objects with smart column mapping
 */
export function convertMatrixToFlashcards(rawRows: any[][], targetDeckId: string): Flashcard[] {
  if (!rawRows || rawRows.length === 0) return [];

  // Remove empty rows
  const cleanRows = rawRows.filter(row => row && row.some(cell => String(cell).trim() !== ''));
  if (cleanRows.length === 0) return [];

  const firstRow = cleanRows[0].map(cell => String(cell).trim());
  const hasHeader = firstRow.some(cell => {
    const norm = normalizeKey(cell);
    return ['word', 'phonetic', 'partOfSpeech', 'vietnamese', 'exampleEn'].includes(norm);
  });

  const cards: Flashcard[] = [];

  if (hasHeader) {
    const keyMap = firstRow.map(header => normalizeKey(header));
    const dataRows = cleanRows.slice(1);

    dataRows.forEach((row, rowIndex) => {
      const obj: any = {};
      row.forEach((cell, colIndex) => {
        const key = keyMap[colIndex];
        if (key) {
          obj[key] = String(cell).trim();
        }
      });

      if (obj.word) {
        cards.push(sanitizeCardData({
          id: `excel-${Date.now()}-${rowIndex}`,
          deckId: targetDeckId,
          word: obj.word,
          phonetic: obj.phonetic || '/.../',
          partOfSpeech: obj.partOfSpeech || 'n.',
          vietnamese: obj.vietnamese || ('Nghĩa của ' + obj.word),
          definition: obj.definition || ('Definition of ' + obj.word),
          exampleEn: obj.exampleEn || `She used the word "${obj.word}" in conversation.`,
          exampleVi: obj.exampleVi || `Cô ấy đã dùng từ "${obj.word}" trong hội thoại.`,
          collocations: obj.collocations ? String(obj.collocations).split(',').map(s => s.trim()).filter(Boolean) : [],
          masteryLevel: 0
        }));
      }
    });
  } else {
    // Positional fallback: [0: Word, 1: Phonetic, 2: PartOfSpeech, 3: Vietnamese, 4: ExampleEn, 5: ExampleVi]
    cleanRows.forEach((row, rowIndex) => {
      const word = String(row[0] || '').trim();
      if (!word) return;

      const phonetic = String(row[1] || '').trim() || '/.../';
      const partOfSpeech = String(row[2] || '').trim() || 'n.';
      const vietnamese = String(row[3] || '').trim() || ('Nghĩa của ' + word);
      const exampleEn = String(row[4] || '').trim() || `She practiced using the word "${word}".`;
      const exampleVi = String(row[5] || '').trim() || `Cô ấy luyện tập sử dụng từ "${word}".`;

      cards.push(sanitizeCardData({
        id: `excel-${Date.now()}-${rowIndex}`,
        deckId: targetDeckId,
        word,
        phonetic,
        partOfSpeech,
        definition: 'Meaning of ' + word,
        vietnamese,
        exampleEn,
        exampleVi,
        masteryLevel: 0
      }));
    });
  }

  return cards;
}

/**
 * Creates and downloads a standard LangMax Excel / CSV template
 */
export function downloadVocabularyTemplate(format: 'csv' | 'xlsx'): void {
  const headers = [
    'Word (Từ vựng)',
    'Phonetic (Phiên âm)',
    'Part of Speech (Loại từ)',
    'Meaning (Nghĩa tiếng Việt)',
    'Example (Ví dụ tiếng Anh)',
    'Example Translation (Dịch ví dụ)',
    'Collocations (Cụm từ đi kèm)'
  ];

  const sampleRows = [
    [
      'innovative',
      '/ˈɪn.ə.veɪ.tɪv/',
      'adj.',
      'Mang tính đổi mới, sáng tạo đột phá',
      'They introduced an innovative solution to reduce waste.',
      'Họ đã giới thiệu một giải pháp mang tính đổi mới để giảm rác thải.',
      'innovative approach, innovative design'
    ],
    [
      'persevere',
      '/ˌpɜː.sɪˈvɪər/',
      'verb',
      'Kiên trì, bền chí không nản lòng',
      'If you persevere through challenges, you will succeed.',
      'Nếu bạn kiên trì vượt qua mọi thử thách, bạn sẽ thành công.',
      'persevere in, persevere with'
    ],
    [
      'pragmatic',
      '/præɡˈmæt.ɪk/',
      'adj.',
      'Thực tế, thực dụng, trọng tính khả thi',
      'We need to adopt a pragmatic approach to solve this issue.',
      'Chúng ta cần áp dụng cách tiếp cận thực tế để giải quyết vấn đề này.',
      'pragmatic approach, pragmatic solution'
    ]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'LangMax_Vocab');

  const filename = `LangMax_Vocabulary_Template.${format}`;
  XLSX.writeFile(workbook, filename, { bookType: format });
}

/**
 * Exports quiz questions to Excel / CSV format for Admin download
 */
export function exportQuizQuestionsToExcel(questions: QuizQuestion[], format: 'xlsx' | 'csv' = 'xlsx'): void {
  const headers = [
    'STT',
    'ID',
    'Dạng bài (Type)',
    'Câu hỏi (Question)',
    'Lựa chọn A',
    'Lựa chọn B',
    'Lựa chọn C',
    'Lựa chọn D',
    'Đáp án đúng (Correct Answer)',
    'Giải thích (Explanation)'
  ];

  const dataRows = questions.map((q, index) => [
    index + 1,
    q.id,
    q.type === 'multiple-choice' ? 'Trắc nghiệm nghĩa' : q.type === 'fill-blank' ? 'Điền khuyết' : 'Luyện nghe',
    q.question,
    q.options[0] || '',
    q.options[1] || '',
    q.options[2] || '',
    q.options[3] || '',
    q.correctAnswer,
    q.explanation || ''
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
  
  // Set column widths for clean spreadsheet layout
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 18 }, // ID
    { wch: 20 }, // Type
    { wch: 45 }, // Question
    { wch: 25 }, // A
    { wch: 25 }, // B
    { wch: 25 }, // C
    { wch: 25 }, // D
    { wch: 30 }, // Answer
    { wch: 40 }  // Explanation
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'NganHangDeThi');

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `LangMax_QuizBank_${timestamp}.${format}`;
  XLSX.writeFile(workbook, filename, { bookType: format });
}
