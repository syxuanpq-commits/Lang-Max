import { Flashcard } from '../types';

/**
 * Validates, trims, and formats flashcard data to ensure integrity across imports and edits
 */
export function sanitizeCardData(raw: Partial<Flashcard> | any): Flashcard {
  const id = raw?.id && typeof raw.id === 'string' && raw.id.trim()
    ? raw.id.trim()
    : `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const deckId = raw?.deckId && typeof raw.deckId === 'string' && raw.deckId.trim()
    ? raw.deckId.trim()
    : 'deck-oxford-3000';

  const word = String(raw?.word || 'Vocabulary').trim();
  const phonetic = String(raw?.phonetic || '').trim() || '/.../';
  const partOfSpeech = String(raw?.partOfSpeech || 'n.').trim();
  const definition = String(raw?.definition || 'Definition of ' + word).trim();
  const vietnamese = String(raw?.vietnamese || 'Định nghĩa của ' + word).trim();
  const exampleEn = String(raw?.exampleEn || `She used the word "${word}" in a sentence.`).trim();
  const exampleVi = String(raw?.exampleVi || `Cô ấy đã sử dụng từ "${word}" trong một câu.`).trim();

  const collocations = Array.isArray(raw?.collocations)
    ? raw.collocations.map((c: any) => String(c).trim()).filter(Boolean)
    : [];

  const synonyms = Array.isArray(raw?.synonyms)
    ? raw.synonyms.map((s: any) => String(s).trim()).filter(Boolean)
    : [];

  const antonyms = Array.isArray(raw?.antonyms)
    ? raw.antonyms.map((a: any) => String(a).trim()).filter(Boolean)
    : [];

  const masteryLevel = typeof raw?.masteryLevel === 'number'
    ? Math.max(0, Math.min(2, Math.floor(raw.masteryLevel)))
    : 0;

  return {
    id,
    deckId,
    word,
    phonetic,
    partOfSpeech,
    definition,
    vietnamese,
    exampleEn,
    exampleVi,
    collocations,
    synonyms,
    antonyms,
    masteryLevel,
    lastReviewed: raw?.lastReviewed || new Date().toISOString(),
    audioUrl: raw?.audioUrl
  };
}
