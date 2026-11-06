import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCardData } from './aiPedagogy';

test('sanitizeCardData provides safe defaults for missing fields', () => {
  const emptyInput = {};
  const cleaned = sanitizeCardData(emptyInput);

  assert.ok(cleaned.id.startsWith('card-'));
  assert.equal(cleaned.word, 'Vocabulary');
  assert.equal(cleaned.deckId, 'deck-oxford-3000');
  assert.equal(cleaned.masteryLevel, 0);
  assert.deepEqual(cleaned.collocations, []);
});

test('sanitizeCardData clamps mastery level between 0 and 2', () => {
  const overClamped = sanitizeCardData({ masteryLevel: 10 });
  assert.equal(overClamped.masteryLevel, 2);

  const underClamped = sanitizeCardData({ masteryLevel: -5 });
  assert.equal(underClamped.masteryLevel, 0);
});

test('sanitizeCardData preserves valid existing attributes', () => {
  const custom = {
    id: 'custom-card-99',
    deckId: 'deck-custom',
    word: 'epiphany',
    phonetic: '/ɪˈpɪf.ən.i/',
    partOfSpeech: 'noun',
    definition: 'A moment of sudden revelation',
    vietnamese: 'Khoảnh khắc ngộ ra điều kỳ diệu',
    exampleEn: 'She had an epiphany while walking.',
    exampleVi: 'Cô ấy đã bừng ngộ khi đang đi dạo.',
    collocations: ['sudden epiphany'],
    masteryLevel: 1
  };
  const cleaned = sanitizeCardData(custom);
  assert.equal(cleaned.id, 'custom-card-99');
  assert.equal(cleaned.word, 'epiphany');
  assert.equal(cleaned.vietnamese, 'Khoảnh khắc ngộ ra điều kỳ diệu');
  assert.equal(cleaned.masteryLevel, 1);
  assert.deepEqual(cleaned.collocations, ['sudden epiphany']);
});
