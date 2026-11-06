import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSVText, convertMatrixToFlashcards, exportQuizQuestionsToExcel } from './excelParser';

test('parseCSVText parses CSV with standard headers', () => {
  const csv = `Word,Phonetic,Part of Speech,Meaning,Example,Example Translation
resilient,/rɪˈzɪl.jənt/,adj.,Kiên cường,She is resilient.,Cô ấy rất kiên cường.
empathy,/ˈem.pə.θi/,noun,Sự thấu cảm,He showed great empathy.,Anh ấy thể hiện sự thấu cảm.`;

  const cards = parseCSVText(csv, 'deck-test');
  assert.equal(cards.length, 2);
  assert.equal(cards[0].word, 'resilient');
  assert.equal(cards[0].vietnamese, 'Kiên cường');
  assert.equal(cards[0].exampleEn, 'She is resilient.');
  assert.equal(cards[1].word, 'empathy');
  assert.equal(cards[1].partOfSpeech, 'noun');
});

test('convertMatrixToFlashcards handles matrix without headers', () => {
  const rawRows = [
    ['eloquent', '/ˈel.ə.kwənt/', 'adj.', 'Hùng biện, lưu loát', 'An eloquent speech.', 'Bài phát biểu hùng biện.']
  ];
  const cards = convertMatrixToFlashcards(rawRows, 'deck-test');
  assert.equal(cards.length, 1);
  assert.equal(cards[0].word, 'eloquent');
  assert.equal(cards[0].phonetic, '/ˈel.ə.kwənt/');
  assert.equal(cards[0].vietnamese, 'Hùng biện, lưu loát');
});

test('exportQuizQuestionsToExcel generates spreadsheet output without error', () => {
  const sampleQuestions = [
    {
      id: 'q-1',
      type: 'multiple-choice' as const,
      question: 'Nghĩa của từ "resilient" là gì?',
      options: ['Kiên cường', 'Yếu ớt', 'Nhanh nhẹn', 'Lười biếng'],
      correctAnswer: 'Kiên cường',
      explanation: 'Resilient nghĩa là có khả năng phục hồi nhanh chóng'
    }
  ];
  
  assert.doesNotThrow(() => {
    exportQuizQuestionsToExcel(sampleQuestions, 'csv');
  });
});
