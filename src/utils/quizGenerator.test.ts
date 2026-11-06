import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuizQuestions, shuffleArray } from './quizGenerator';
import { Flashcard } from '../types';

const sampleCards: Flashcard[] = [
  {
    id: 'test-1',
    deckId: 'deck-1',
    word: 'resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'noun',
    definition: 'Capacity to recover',
    vietnamese: 'Kiên cường',
    exampleEn: 'She showed resilience in trials.',
    exampleVi: 'Cô ấy kiên cường.',
    masteryLevel: 1
  },
  {
    id: 'test-2',
    deckId: 'deck-1',
    word: 'meticulous',
    phonetic: '/məˈtɪk.jə.ləs/',
    partOfSpeech: 'adj.',
    definition: 'Very careful and precise',
    vietnamese: 'Tỉ mỉ',
    exampleEn: 'He is meticulous in his work.',
    exampleVi: 'Anh ấy rất tỉ mỉ.',
    masteryLevel: 0
  },
  {
    id: 'test-3',
    deckId: 'deck-1',
    word: 'collaborate',
    phonetic: '/kəˈlæb.ə.reɪt/',
    partOfSpeech: 'verb',
    definition: 'Work jointly',
    vietnamese: 'Hợp tác',
    exampleEn: 'We must collaborate closely.',
    exampleVi: 'Chúng ta phải hợp tác.',
    masteryLevel: 2
  }
];

test('generateQuizQuestions creates multiple choice questions for each card', () => {
  const questions = generateQuizQuestions(sampleCards);
  assert.ok(questions.length > 0, 'Questions list should not be empty');

  const mcQuestions = questions.filter(q => q.type === 'multiple-choice');
  assert.equal(mcQuestions.length, 3, 'Should generate 3 multiple-choice questions');

  // Verify options count and correctness
  for (const q of mcQuestions) {
    assert.equal(q.options.length, 4, 'Multiple-choice question should have exactly 4 options');
    assert.ok(q.options.includes(q.correctAnswer), 'Options must include the correct answer');
  }
});

test('generateQuizQuestions creates fill-in-the-blank questions when example contains the word', () => {
  const questions = generateQuizQuestions(sampleCards);
  const fibQuestions = questions.filter(q => q.type === 'fill-blank');
  assert.ok(fibQuestions.length >= 2, 'Should generate fill-in-blank questions');
  for (const q of fibQuestions) {
    assert.ok(q.question.includes('__________'), 'Question should have a blank indicator');
    assert.ok(q.options.includes(q.correctAnswer), 'Options must contain the target word');
  }
});

test('shuffleArray returns array with same elements', () => {
  const original = [1, 2, 3, 4, 5];
  const shuffled = shuffleArray(original);
  assert.equal(shuffled.length, original.length);
  assert.deepEqual(new Set(shuffled), new Set(original));
});
