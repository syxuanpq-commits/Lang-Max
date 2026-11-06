import { Flashcard, QuizQuestion } from '../types';

/**
 * Shuffles an array immutably using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Dynamically generates an engaging set of interactive Quiz questions from flashcard items
 */
export function generateQuizQuestions(flashcards: Flashcard[]): QuizQuestion[] {
  if (!flashcards || flashcards.length === 0) {
    return [];
  }

  const questions: QuizQuestion[] = [];
  const validCards = flashcards.filter(c => c.word && c.vietnamese);

  validCards.forEach((card, index) => {
    // 1. Multiple-choice question: Meaning of English Word
    const otherCards = validCards.filter(c => c.id !== card.id);
    const distractorMeanings = shuffleArray(
      otherCards.map(c => c.vietnamese).filter(v => v !== card.vietnamese)
    ).slice(0, 3);

    // If not enough distractors from existing cards, provide sensible defaults
    const fallbackDistractors = [
      'Phát triển bền vững',
      'Thành công vang dội',
      'Đổi mới công nghệ',
      'Hợp tác chiến lược',
      'Quản lý hiệu quả'
    ];
    while (distractorMeanings.length < 3) {
      const fb = fallbackDistractors[distractorMeanings.length % fallbackDistractors.length];
      if (!distractorMeanings.includes(fb) && fb !== card.vietnamese) {
        distractorMeanings.push(fb);
      } else {
        distractorMeanings.push(`Khái niệm khác (${distractorMeanings.length + 1})`);
      }
    }

    const mcOptions = shuffleArray([card.vietnamese, ...distractorMeanings]);

    questions.push({
      id: `q-mc-${card.id}-${index}`,
      deckId: card.deckId,
      flashcardId: card.id,
      type: 'multiple-choice',
      question: `Nghĩa tiếng Việt chính xác của từ "${card.word}" (${card.phonetic}) là gì?`,
      options: mcOptions,
      correctAnswer: card.vietnamese,
      explanation: `"${card.word}" (${card.partOfSpeech}) có nghĩa là "${card.vietnamese}". Ví dụ: ${card.exampleEn}`
    });

    // 2. Fill-in-the-blank question from example sentence if available
    if (card.exampleEn && card.exampleEn.toLowerCase().includes(card.word.toLowerCase())) {
      // Regex replace word case-insensitively with blank line
      const regex = new RegExp(`\\b${card.word}\\b`, 'i');
      const blankSentence = card.exampleEn.replace(regex, '__________');

      const distractorWords = shuffleArray(
        otherCards.map(c => c.word).filter(w => w.toLowerCase() !== card.word.toLowerCase())
      ).slice(0, 3);

      const fallbackWords = ['adapt', 'analyze', 'evaluate', 'innovate', 'sustain'];
      while (distractorWords.length < 3) {
        const fw = fallbackWords[distractorWords.length % fallbackWords.length];
        if (!distractorWords.includes(fw) && fw.toLowerCase() !== card.word.toLowerCase()) {
          distractorWords.push(fw);
        } else {
          distractorWords.push(`term_${distractorWords.length}`);
        }
      }

      const fillOptions = shuffleArray([card.word, ...distractorWords]);

      questions.push({
        id: `q-fib-${card.id}-${index}`,
        deckId: card.deckId,
        flashcardId: card.id,
        type: 'fill-blank',
        question: `Điền từ thích hợp vào chỗ trống:\n"${blankSentence}"`,
        options: fillOptions,
        correctAnswer: card.word,
        explanation: `Câu hoàn chỉnh: "${card.exampleEn}"\nDịch nghĩa: "${card.exampleVi}"`
      });
    }

    // 3. Listening & Pronunciation Question
    if (index % 2 === 0) {
      const listeningDistractors = shuffleArray(
        otherCards.map(c => c.word).filter(w => w !== card.word)
      ).slice(0, 3);
      while (listeningDistractors.length < 3) {
        listeningDistractors.push(`Distractor ${listeningDistractors.length + 1}`);
      }

      questions.push({
        id: `q-listen-${card.id}-${index}`,
        deckId: card.deckId,
        flashcardId: card.id,
        type: 'listening',
        question: `Lắng nghe phát âm và chọn từ vựng đúng: [Phiên âm: ${card.phonetic}]`,
        audioText: card.word,
        options: shuffleArray([card.word, ...listeningDistractors]),
        correctAnswer: card.word,
        explanation: `Từ được phát âm là "${card.word}" ${card.phonetic} - nghĩa: "${card.vietnamese}".`
      });
    }
  });

  return questions;
}
